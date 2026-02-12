import { db } from "./db";
import { cves, type Cve, type InsertCve } from "@shared/schema";
import { desc, eq, inArray } from "drizzle-orm";

export interface IStorage {
  getLatestCves(limit: number): Promise<Cve[]>;
  upsertCves(items: InsertCve[]): Promise<{ inserted: number; updated: number }>;
}

export class DatabaseStorage implements IStorage {
  async getLatestCves(limit: number): Promise<Cve[]> {
    return await db.select().from(cves).orderBy(desc(cves.publishedAt)).limit(limit);
  }

  async upsertCves(items: InsertCve[]): Promise<{ inserted: number; updated: number }> {
    if (items.length === 0) return { inserted: 0, updated: 0 };

    const ids = items.map((i) => i.cveId);
    const existing = await db
      .select({ cveId: cves.cveId })
      .from(cves)
      .where(inArray(cves.cveId, ids));
    const existingSet = new Set(existing.map((e) => e.cveId));

    const inserted = items.filter((i) => !existingSet.has(i.cveId)).length;
    const updated = items.length - inserted;

    await db
      .insert(cves)
      .values(items)
      .onConflictDoUpdate({
        target: cves.cveId,
        set: {
          cvssScoreX10: cves.cvssScoreX10,
          severity: cves.severity,
          publishedAt: cves.publishedAt,
          description: cves.description,
          metrics: cves.metrics,
        },
      });

    // drizzle onConflictDoUpdate set can't reference excluded directly here; use a second pass update.
    // To keep it simple and correct, update each record with incoming values.
    for (const item of items) {
      await db
        .update(cves)
        .set({
          cvssScoreX10: item.cvssScoreX10,
          severity: item.severity,
          publishedAt: item.publishedAt,
          description: item.description,
          metrics: item.metrics,
        })
        .where(eq(cves.cveId, item.cveId));
    }

    return { inserted, updated };
  }
}

export const storage = new DatabaseStorage();
