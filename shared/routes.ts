import { z } from "zod";
import { ads } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  ads: {
    list: {
      method: 'GET' as const,
      path: '/api/ads' as const,
      responses: {
        200: z.array(z.custom<typeof ads.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/ads' as const,
      input: z.object({
        inputText: z.string().optional(),
        image: z.string().optional(), // base64 image representation
        voiceStyle: z.string(),
        musicStyle: z.string().optional(),
        duration: z.coerce.number()
      }),
      responses: {
        201: z.custom<typeof ads.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/ads/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
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

export type CreateAdRequest = z.infer<typeof api.ads.create.input>;
export type AdResponse = z.infer<typeof api.ads.create.responses[201]>;
export type AdsListResponse = z.infer<typeof api.ads.list.responses[200]>;
