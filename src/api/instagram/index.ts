import apiClient from "@/api/apiClient";
import { InstagramMediasResponse, InstagramMedia } from "@/types/instagram";

export type GetInstagramMediasParams = {
  limit?: number;
  next?: string | null;
};

export const getInstagramMedias = async (
  params: GetInstagramMediasParams = {}
): Promise<InstagramMediasResponse> => {
  const queryParams: Record<string, unknown> = {};

  if (typeof params.limit === "number") {
    queryParams.limit = params.limit;
  }

  if (params.next) {
    queryParams.next = params.next;
  }

  try {
    const response = await apiClient.get("/api/instagram/medias", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Instagram medias", error);
    throw error;
  }
};

export type InstagramMediaItem = InstagramMedia;
