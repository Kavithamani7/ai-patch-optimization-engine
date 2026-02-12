import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

type NvdApiResponse = {
  vulnerabilities?: Array<{
    cve?: {
      id?: string;
      published?: string;
      descriptions?: Array<{ lang?: string; value?: string }>;
      metrics?: Record<string, unknown>;
    };
  }>;
};

function severityFromScore(score: number): "Low" | "Medium" | "High" | "Critical" {
  if (score >= 9.0) return "Critical";
  if (score >= 7.0) return "High";
  if (score >= 4.0) return "Medium";
  return "Low";
}

function safeNumber(n: unknown, fallback: number): number {
  const x = typeof n === "number" ? n : Number(n);
  return Number.isFinite(x) ? x : fallback;
}

function pickDescription(desc?: Array<{ lang?: string; value?: string }>): string {
  if (!desc || desc.length === 0) return "";
  const en = desc.find((d) => d.lang === "en" && typeof d.value === "string");
  const any = desc.find((d) => typeof d.value === "string");
  return (en?.value ?? any?.value ?? "").trim();
}

function extractCvssBaseScore(metrics: Record<string, unknown> | undefined): number {
  if (!metrics) return 0;

  const order = [
    "cvssMetricV40",
    "cvssMetricV31",
    "cvssMetricV30",
    "cvssMetricV2",
  ];

  for (const key of order) {
    const arr = (metrics as any)[key];
    if (Array.isArray(arr) && arr.length > 0) {
      const m = arr[0];
      const data = m?.cvssData;
      const score = data?.baseScore;
      const base = safeNumber(score, NaN);
      if (Number.isFinite(base)) return base;
    }
  }

  return 0;
}

async function fetchNvdRecentCves(limit: number): Promise<{
  ok: true;
  items: Array<{
    cveId: string;
    publishedAt: Date;
    description: string;
    cvssScore: number;
    metrics: Record<string, unknown>;
  }>;
} | {
  ok: false;
  message: string;
}> {
  // NVD endpoint (v2). Use resultsPerPage to control volume.
  const url = new URL("https://services.nvd.nist.gov/rest/json/cves/2.0");
  url.searchParams.set("resultsPerPage", String(Math.min(Math.max(limit, 1), 200)));

  // Set a time window to bias toward "recent" without relying on sorting.
  const now = new Date();
  const start = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14); // last 14 days
  url.searchParams.set("pubStartDate", start.toISOString());
  url.searchParams.set("pubEndDate", now.toISOString());

  let resp: Response;
  try {
    resp = await fetch(url.toString(), {
      headers: {
        "User-Agent": "replit-threat-feed/1.0",
        Accept: "application/json",
      },
    });
  } catch {
    return { ok: false, message: "Unable to reach NVD right now." };
  }

  if (!resp.ok) {
    return { ok: false, message: `NVD returned ${resp.status}. Try again shortly.` };
  }

  let data: NvdApiResponse;
  try {
    data = (await resp.json()) as NvdApiResponse;
  } catch {
    return { ok: false, message: "NVD response was not valid JSON." };
  }

  const vulns = Array.isArray(data.vulnerabilities) ? data.vulnerabilities : [];

  const items = vulns
    .map((v) => v.cve)
    .filter(Boolean)
    .map((cve) => {
      const cveId = String(cve?.id ?? "").trim();
      const published = String(cve?.published ?? "").trim();
      const publishedAt = published ? new Date(published) : new Date(0);
      const description = pickDescription(cve?.descriptions);
      const metrics = (cve?.metrics ?? {}) as Record<string, unknown>;
      const cvssScore = extractCvssBaseScore(metrics);

      return {
        cveId,
        publishedAt,
        description,
        cvssScore,
        metrics,
      };
    })
    .filter((x) => x.cveId && Number.isFinite(x.publishedAt.getTime()));

  return { ok: true, items };
}

async function seedThreatFeedIfEmpty() {
  const existing = await storage.getLatestCves(1);
  if (existing.length > 0) return;

  // Seed with a one-time refresh attempt (best-effort). If NVD is unavailable,
  // the dashboard still loads but feed will be empty until refresh works.
  const result = await fetchNvdRecentCves(25);
  if (!result.ok) return;

  await storage.upsertCves(
    result.items.map((item) => {
      const score = Math.max(0, Math.min(10, item.cvssScore));
      return {
        cveId: item.cveId,
        cvssScoreX10: Math.round(score * 10),
        severity: severityFromScore(score),
        publishedAt: item.publishedAt,
        description: item.description || "No description provided.",
        metrics: item.metrics,
      };
    }),
  );
}

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  await seedThreatFeedIfEmpty();

  app.get(api.threatFeed.latest.path, async (req, res) => {
    const parsed = api.threatFeed.latest.input?.safeParse(req.query);
    const limit = parsed?.success ? parsed.data?.limit ?? 25 : 25;
    const source = parsed?.success ? parsed.data?.source ?? "cache" : "cache";

    if (source === "nvd") {
      const live = await fetchNvdRecentCves(limit);
      if (!live.ok) {
        return res.status(502).json({ message: live.message, upstream: "nvd" });
      }

      // Persist to cache, then return cached ordering (published desc) for consistency.
      await storage.upsertCves(
        live.items.map((item) => {
          const score = Math.max(0, Math.min(10, item.cvssScore));
          return {
            cveId: item.cveId,
            cvssScoreX10: Math.round(score * 10),
            severity: severityFromScore(score),
            publishedAt: item.publishedAt,
            description: item.description || "No description provided.",
            metrics: item.metrics,
          };
        }),
      );
    }

    const items = await storage.getLatestCves(limit);
    return res.json(items);
  });

  app.post(api.threatFeed.refresh.path, async (req, res) => {
    try {
      const body = api.threatFeed.refresh.input.parse(req.body);
      const limit = body.limit ?? 25;

      const live = await fetchNvdRecentCves(limit);
      if (!live.ok) {
        return res.status(502).json({ message: live.message, upstream: "nvd" });
      }

      const { inserted, updated } = await storage.upsertCves(
        live.items.map((item) => {
          const score = Math.max(0, Math.min(10, item.cvssScore));
          return {
            cveId: item.cveId,
            cvssScoreX10: Math.round(score * 10),
            severity: severityFromScore(score),
            publishedAt: item.publishedAt,
            description: item.description || "No description provided.",
            metrics: item.metrics,
          };
        }),
      );

      return res.json({ inserted, updated, total: inserted + updated });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message ?? "Invalid request",
          field: err.errors[0]?.path?.join("."),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
