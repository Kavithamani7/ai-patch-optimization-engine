import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type LatestThreatFeedQuery, type ThreatFeedRefreshRequest } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

function buildQueryString(input?: LatestThreatFeedQuery) {
  if (!input) return "";
  const params = new URLSearchParams();
  if (typeof input.limit === "number") params.set("limit", String(input.limit));
  if (input.source) params.set("source", input.source);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function threatFeedLatestKey(input?: LatestThreatFeedQuery) {
  return [api.threatFeed.latest.path, input?.limit ?? null, input?.source ?? null] as const;
}

export function useLatestThreatFeed(input?: LatestThreatFeedQuery) {
  return useQuery({
    queryKey: threatFeedLatestKey(input),
    queryFn: async () => {
      const qs = buildQueryString(input);
      const res = await fetch(`${api.threatFeed.latest.path}${qs}`, { credentials: "include" });

      if (res.status === 502) {
        const err = parseWithLogging(api.threatFeed.latest.responses[502], await res.json(), "threatFeed.latest.502");
        throw new Error(err.message || "Upstream error");
      }
      if (!res.ok) throw new Error("Failed to fetch latest threat feed");

      const json = await res.json();
      return parseWithLogging(api.threatFeed.latest.responses[200], json, "threatFeed.latest.200");
    },
    staleTime: 20_000,
    refetchOnWindowFocus: false,
  });
}

export function useRefreshThreatFeed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: ThreatFeedRefreshRequest) => {
      const validated = api.threatFeed.refresh.input.parse(body);
      const res = await fetch(api.threatFeed.refresh.path, {
        method: api.threatFeed.refresh.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (res.status === 502) {
        const err = parseWithLogging(api.threatFeed.refresh.responses[502], await res.json(), "threatFeed.refresh.502");
        throw new Error(err.message || "Upstream error");
      }
      if (!res.ok) throw new Error("Failed to refresh threat feed");

      return parseWithLogging(api.threatFeed.refresh.responses[200], await res.json(), "threatFeed.refresh.200");
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: [api.threatFeed.latest.path] });
    },
  });
}
