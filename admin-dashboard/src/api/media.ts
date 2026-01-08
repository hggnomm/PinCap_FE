import apiClient from "./apiClient";
import type { MessageResponse } from "./types";

// ==================== Types ====================
export interface AdminMedia {
  id: string;
  media_name: string | null;
  media_url: string | string[];
  type: "IMAGE" | "VIDEO" | null;
  media_type?: string | null; // For backward compatibility
  user_id?: string; // For backward compatibility
  media_owner_id: string;
  album_id?: string | null;
  description?: string | null;
  privacy?: "PUBLIC" | "PRIVATE" | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  user_owner?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string | null;
  };
  safe_search_data?: Array<{
    racy?: string;
    adult?: string;
    spoof?: string;
    medical?: string;
    violence?: string;
  }> | null;
  reactions_count?: number;
  comments_count?: number;
  albums_count?: number;
}

export interface GetMediasParams {
  media_name?: string;
  description?: string;
  user_search?: string; // Search by user (email, first name, or last name)
  type?: "0" | "1"; // "0": IMAGE, "1": VIDEO
  media_type?: string; // For backward compatibility
  privacy?: "0" | "1"; // "0": PRIVATE, "1": PUBLIC
  is_created?: 0 | 1; // 0: false, 1: true
  is_comment?: 0 | 1; // 0: false, 1: true
  is_policy_violation?: 0 | 1; // 0: false, 1: true
  media_owner_id?: string;
  user_id?: string; // For backward compatibility
  album_id?: string;
  deleted_at?: "null" | "not_null";
  per_page?: number;
  page?: number;
  order_key?: string;
  order_type?: "asc" | "desc";
}

export interface CreateMediaData {
  media_name: string;
  media_url: string;
  media_type?: string | null;
  user_id: string;
  album_id?: string | null;
  description?: string | null;
  privacy?: string | null;
}

export interface UpdateMediaData {
  media_name?: string;
  media_url?: string;
  media_type?: string | null;
  user_id?: string;
  album_id?: string | null;
  description?: string | null;
  privacy?: string | null;
}

export interface GetMediasResponse {
  data: AdminMedia[];
  total?: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
}

export interface MediaResponse {
  data: AdminMedia;
}

// ==================== API Functions ====================

/**
 * Get list of medias with search, filter and pagination
 */
export const getMedias = async (
  params?: GetMediasParams
): Promise<GetMediasResponse> => {
  try {
    const response = await apiClient.get("/api/admin/medias", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to get medias:", error);
    throw error;
  }
};

/**
 * Create a new media
 */
export const createMedia = async (
  data: CreateMediaData
): Promise<MediaResponse> => {
  try {
    const response = await apiClient.post("/api/admin/medias", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create media:", error);
    throw error;
  }
};

/**
 * Update media information
 */
export const updateMedia = async (
  mediaId: string,
  data: UpdateMediaData
): Promise<MediaResponse> => {
  try {
    const response = await apiClient.put(`/api/admin/medias/${mediaId}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update media:", error);
    throw error;
  }
};

/**
 * Soft delete a media
 */
export const deleteMedia = async (
  mediaId: string
): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(`/api/admin/medias/${mediaId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete media:", error);
    throw error;
  }
};

/**
 * Restore a soft-deleted media
 */
export const restoreMedia = async (mediaId: string): Promise<MediaResponse> => {
  try {
    const response = await apiClient.post(
      `/api/admin/medias/${mediaId}/restore`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to restore media:", error);
    throw error;
  }
};

/**
 * Permanently delete a media from database
 */
export const forceDeleteMedia = async (
  mediaId: string
): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(
      `/api/admin/medias/${mediaId}/force`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to force delete media:", error);
    throw error;
  }
};
