import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { openai } from "./replit_integrations/audio/client";
import { Buffer } from "node:buffer";
import fs from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";
import crypto from "crypto";

// Need to increase body limit for image upload
import express from "express";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Use a larger limit for base64 images
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get(api.ads.list.path, async (req, res) => {
    try {
      const adsList = await storage.getAds();
      res.json(adsList);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch ads" });
    }
  });

  app.post(api.ads.create.path, async (req, res) => {
    try {
      const input = api.ads.create.input.parse(req.body);
      
      let extractedText = input.inputText || "";

      // Step 1: Extract text if image is provided
      if (input.image && !extractedText) {
        // use OpenAI vision to extract text
        const response = await openai.chat.completions.create({
          model: "gpt-4o", // use standard gpt-4o for vision
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Extract all the promotional text from this image." },
                {
                  type: "image_url",
                  image_url: {
                    url: input.image,
                  },
                },
              ],
            },
          ],
        });
        extractedText = response.choices[0]?.message?.content || "Promotion";
      }

      if (!extractedText) {
        return res.status(400).json({ message: "Either text or image is required" });
      }

      // Step 2: Generate Ad Script
      const scriptPrompt = `
      Convert the following promotional text into a professional radio-style advertisement script.
      Duration: ~${input.duration} seconds.
      Make it engaging and appropriate for a commercial.
      
      Input text:
      "${extractedText}"
      `;

      const scriptResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: scriptPrompt }]
      });

      const generatedScript = scriptResponse.choices[0]?.message?.content || extractedText;

      // Step 3: Generate Voice Audio
      // Map voice styles to OpenAI voices:
      // Male -> onyx, Female -> nova, Energetic -> fable, Calm -> alloy
      let voiceId: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer" = "nova";
      const vs = input.voiceStyle.toLowerCase();
      if (vs.includes("male")) voiceId = "onyx";
      if (vs.includes("energetic")) voiceId = "fable";
      if (vs.includes("calm")) voiceId = "alloy";
      if (vs === "female") voiceId = "nova";

      // Text-to-speech using OpenAI audio integration
      const ttsResponse = await openai.chat.completions.create({
        model: "gpt-audio",
        modalities: ["text", "audio"],
        audio: { voice: voiceId, format: "mp3" },
        messages: [
          { role: "system", content: "You are a professional radio advertisement voiceover artist. Read the text enthusiastically." },
          { role: "user", content: generatedScript }
        ]
      });

      const audioData = (ttsResponse.choices[0]?.message as any)?.audio?.data ?? "";
      const voiceBuffer = Buffer.from(audioData, "base64");

      // Save the ad to database
      const savedAd = await storage.createAd({
        inputText: extractedText,
        generatedScript,
        voiceStyle: input.voiceStyle,
        musicStyle: input.musicStyle || "None",
        duration: input.duration,
        finalAudioUrl: null // We will just store the audio data locally or return as base64
      });

      // Instead of relying on a real background track right away (since we don't have them),
      // we will just save the voiceBuffer to a static file and serve it.
      // In a more complete version, we would use ffmpeg to mix an actual music file.
      const fileName = `ad_${savedAd.id}_${crypto.randomBytes(4).toString('hex')}.mp3`;
      const publicDir = path.join(process.cwd(), "client", "public", "audio");
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const filePath = path.join(publicDir, fileName);
      fs.writeFileSync(filePath, voiceBuffer);

      const finalAudioUrl = `/audio/${fileName}`;
      
      // Update ad with url (we can't update easily with our IStorage right now, so we just return the object modified,
      // but let's actually add updateAd method or just do a raw update)
      // Actually we will modify the storage to include an update
      // Let's do it via direct DB for now:
      // Oh wait, storage is better. Let me update the db record:
      const { db } = await import("./db");
      const { ads } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      await db.update(ads).set({ finalAudioUrl }).where(eq(ads.id, savedAd.id));

      const updatedAd = { ...savedAd, finalAudioUrl };

      res.status(201).json(updatedAd);
    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to create ad" });
    }
  });

  app.delete(api.ads.delete.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAd(id);
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ message: "Failed to delete ad" });
    }
  });

  return httpServer;
}
