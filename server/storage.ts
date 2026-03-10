import { db } from "./db";
import { ads, type CreateAdRequest, type AdResponse } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getAds(): Promise<AdResponse[]>;
  getAd(id: number): Promise<AdResponse | undefined>;
  createAd(ad: Omit<typeof ads.$inferInsert, "id" | "createdAt">): Promise<AdResponse>;
  deleteAd(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAds(): Promise<AdResponse[]> {
    return await db.select().from(ads).orderBy(desc(ads.createdAt));
  }

  async getAd(id: number): Promise<AdResponse | undefined> {
    const [ad] = await db.select().from(ads).where(eq(ads.id, id));
    return ad;
  }

  async createAd(insertAd: Omit<typeof ads.$inferInsert, "id" | "createdAt">): Promise<AdResponse> {
    const [ad] = await db.insert(ads).values(insertAd).returning();
    return ad;
  }

  async deleteAd(id: number): Promise<void> {
    await db.delete(ads).where(eq(ads.id, id));
  }
}

export const storage = new DatabaseStorage();
