import { useQuery } from "@tanstack/react-query";
import { searchMedia } from "../api/media";
import { SEARCH_CONSTANTS } from "../constants";

export interface SearchMediaParams {
  search?: string;
  page: number;
  per_page: number;
}

export interface SearchMediaResponse {
  data: {
    id: string;
    media_url: string;
    media_name: string;
    description: string;
  }[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const useSearchMedia = (params: SearchMediaParams) => {
  const { search, page, per_page } = params;

  return useQuery({
    queryKey: ["searchMedia", { search, page, per_page }],
    queryFn: async (): Promise<SearchMediaResponse> => {
      console.log("🔍 useSearchMedia - Search params:", {
        search,
        page,
        per_page,
      });

      const results = await searchMedia({
        search,
        page,
        per_page,
      });

      console.log("📊 useSearchMedia - Search results:", results);
      return results;
    },
    enabled:
      !!search?.trim() && search.length >= SEARCH_CONSTANTS.MIN_SEARCH_LENGTH,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors (no results found)
      if (error?.response?.status === 404) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    throwOnError: false, // Don't throw errors to prevent notification popups
  });
};

// Hook for search suggestions (if needed in the future)
export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: ["searchSuggestions", query],
    queryFn: async () => {
      // This would be a separate API call for suggestions
      // For now, return empty array
      return [];
    },
    enabled: query.length >= 2, // Only search when user types at least 2 characters
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for popular searches (if needed in the future)
export const usePopularSearches = () => {
  return useQuery({
    queryKey: ["popularSearches"],
    queryFn: async () => {
      // This would be a separate API call for popular searches
      // For now, return static data
      return [
        "Nature Photography",
        "Food Recipes",
        "Travel Tips",
        "Art & Design",
        "Technology",
        "Fashion",
      ];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};
