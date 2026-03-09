import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateAdRequest, type AdsListResponse, type AdResponse } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useAds() {
  return useQuery({
    queryKey: [api.ads.list.path],
    queryFn: async () => {
      const res = await fetch(api.ads.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch ads history");
      const data = await res.json();
      return parseWithLogging(api.ads.list.responses[200], data, "ads.list");
    },
  });
}

export function useCreateAd() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateAdRequest) => {
      // Validate locally first to catch errors early
      const validated = api.ads.create.input.parse(data);
      
      const res = await fetch(api.ads.create.path, {
        method: api.ads.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          const error = api.ads.create.responses[400].parse(errorData);
          throw new Error(error.message || "Validation failed");
        }
        if (res.status === 500) {
          const errorData = await res.json();
          const error = api.ads.create.responses[500].parse(errorData);
          throw new Error(error.message || "Internal server error");
        }
        throw new Error("Failed to create ad");
      }

      const responseData = await res.json();
      return parseWithLogging(api.ads.create.responses[201], responseData, "ads.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.ads.list.path] });
    },
  });
}
