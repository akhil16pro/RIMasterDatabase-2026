// @/api/queries.ts
import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/api";

export const sessionQueryOptions = (lang: string) => 
  queryOptions({
    queryKey: ["session"],
    queryFn: async () => {
      // This endpoint should verify the HttpOnly cookie/session
      return await apiClient.get(`${lang}/auth/me`).json<any>();
    },
    staleTime: 1000 * 60 * 5, // Consider session valid for 5 minutes
    retry: false, // Don't retry on 401
  });