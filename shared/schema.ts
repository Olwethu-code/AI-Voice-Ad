import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  inputText: text("input_text").notNull(),
  generatedScript: text("generated_script"),
  voiceStyle: text("voice_style").notNull(),
  musicStyle: text("music_style").notNull(),
  duration: integer("duration").notNull(),
  finalAudioUrl: text("final_audio_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAdSchema = createInsertSchema(ads).omit({ 
  id: true, 
  createdAt: true,
  generatedScript: true,
  finalAudioUrl: true,
  inputText: true // Made optional below for input request
});

export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema> & { inputText: string };

export type CreateAdRequest = {
  inputText?: string;
  image?: string; // base64 encoded image
  voiceStyle: string;
  musicStyle: string;
  duration: number;
};

export type AdResponse = Ad;
