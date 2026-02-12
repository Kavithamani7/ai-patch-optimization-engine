import { z } from "zod";
import { insertCveSchema, type Cve } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  upstream: z.object({
    message: z.string(),
    upstream: z.string().optional(),
  }),
};

const cveResponseSchema = z.custom<Cve>();

export const api = {
  threatFeed: {
    latest: {
      method: "GET" as const,
      path: "/api/threat-feed/latest" as const,
      input: z
        .object({
          limit: z.coerce.number().int().min(1).max(200).optional(),
          source: z.enum(["nvd", "cache"]).optional(),
        })
        .optional(),
      responses: {
        200: z.array(cveResponseSchema),
        502: errorSchemas.upstream,
      },
    },
    refresh: {
      method: "POST" as const,
      path: "/api/threat-feed/refresh" as const,
      input: z.object({
        limit: z.coerce.number().int().min(1).max(200).optional(),
      }),
      responses: {
        200: z.object({
          inserted: z.number().int().min(0),
          updated: z.number().int().min(0),
          total: z.number().int().min(0),
        }),
        502: errorSchemas.upstream,
      },
    },
  },
} as const;

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type LatestThreatFeedQuery = z.infer<typeof api.threatFeed.latest.input>;
export type LatestThreatFeedResponse = z.infer<
  typeof api.threatFeed.latest.responses[200]
>;
export type ThreatFeedRefreshRequest = z.infer<typeof api.threatFeed.refresh.input>;
export type ThreatFeedRefreshResponse = z.infer<
  typeof api.threatFeed.refresh.responses[200]
>;
