import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================
// CVE Threat Feed (NVD integration)
// ============================================

export const cves = pgTable("cves", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),

  // NVD CVE ID, e.g. "CVE-2026-12345"
  cveId: varchar("cve_id", { length: 32 }).notNull().unique(),

  // CVSS base score (0.0 - 10.0). Stored as integer * 10 to avoid float issues.
  cvssScoreX10: integer("cvss_score_x10").notNull(),

  // Convenience normalized severity label
  severity: varchar("severity", { length: 16 }).notNull(),

  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),

  description: text("description").notNull(),

  // Raw NVD metrics payload (kept for traceability/debugging)
  metrics: jsonb("metrics").notNull().default(sql`'{}'::jsonb`),
});

export const insertCveSchema = createInsertSchema(cves).omit({
  id: true,
});

export type Cve = typeof cves.$inferSelect;
export type InsertCve = z.infer<typeof insertCveSchema>;

export type LatestCvesResponse = Cve[];

export interface ThreatFeedQueryParams {
  limit?: number;
  source?: "nvd" | "cache";
}

export type ModelCveFeatureVector = {
  cveId: string;
  cvssScore: number;
  severity: "Low" | "Medium" | "High" | "Critical";
  publishedAt: string;
  description: string;
  exploitabilityScore?: number;
  impactScore?: number;
};
