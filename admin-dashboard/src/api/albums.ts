import apiClient from "./apiClient";
import type { MessageResponse } from "./types";

// ==================== Types ====================
export interface AdminAlbum {
  id: string;
  album_name: string;
  image_cover?: string | null;
  description?: string | null;
  privacy?: "PUBLIC" | "PRIVATE" | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  medias_count?: number;
  user_owner?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string | null;
  };
}

export interface GetAlbumsParams {
  album_name?: string;
  description?: string;
  user_search?: string; // Search by user (email, first name, or last name)
  privacy?: "0" | "1"; // "0": PRIVATE, "1": PUBLIC
  user_id?: string; // Filter by album owner user ID
  deleted_at?: "null" | "not_null";
  per_page?: number;
  page?: number;
  order_key?: string;
  order_type?: "asc" | "desc";
}

export interface GetAlbumsResponse {
  data: AdminAlbum[];
  total?: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
}

export interface AlbumResponse {
  data: AdminAlbum;
}

// ==================== API Functions ====================

/**
 * Get list of albums with search, filter and pagination
 */
export const getAlbums = async (
  params?: GetAlbumsParams
): Promise<GetAlbumsResponse> => {
  try {
    const response = await apiClient.get("/api/admin/albums", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to get albums:", error);
    throw error;
  }
};

/**
 * Restore a soft-deleted album (set deleted_at to null)
 */
export const restoreAlbum = async (
  albumId: string
): Promise<AlbumResponse> => {
  try {
    const response = await apiClient.put(`/api/admin/albums/${albumId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to restore album:", error);
    throw error;
  }
};

/**
 * Permanently delete an album from database and all its album_media relationships
 */
export const forceDeleteAlbum = async (
  albumId: string
): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(
      `/api/admin/albums/${albumId}/force`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to force delete album:", error);
    throw error;
  }
};

