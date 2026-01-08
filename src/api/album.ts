import { ALBUM_ROLES } from "@/constants/constants";
import { CreateAlbumFormData } from "@/validation/album";

import apiClient from "./apiClient"; // Đường dẫn tới tệp apiClient

export const getMyAlbumData = async (params?: {
  per_page?: number;
  page?: number;
  query?: string;
  order_key?: string;
  order_type?: string;
  media_id?: string;
}) => {
  try {
    const res = await apiClient.get("/api/albums/my-album", { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getDetailAlbum = async (albumId: string) => {
  try {
    const res = await apiClient.get(`/api/albums/${albumId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw error so React Query can catch it
  }
};

export const createMyAlbum = async (request: CreateAlbumFormData) => {
  try {
    const res = await apiClient.post("/api/albums", request);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateMyAlbum = async (
  albumId: string,
  request: CreateAlbumFormData
) => {
  try {
    const res = await apiClient.put(`/api/albums/${albumId}`, request);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMyAlbum = async (albumId: string) => {
  try {
    const res = await apiClient.delete(`/api/albums/${albumId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const addMediasToAlbum = async (request: any) => {
  try {
    const res = await apiClient.post("/api/albums/add-medias", request);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get albums by user ID with pagination and filters
export const getAlbumsByUserId = async (params: {
  user_id: string;
  per_page?: number;
  page?: number;
  query?: string;
  order_key?: string;
  order_type?: string;
}) => {
  try {
    const res = await apiClient.get("/api/albums", { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get all public albums with pagination and search
export const getAllAlbums = async (params?: {
  per_page?: number;
  page?: number;
  query?: string;
  order_key?: string;
  order_type?: string;
}) => {
  try {
    const res = await apiClient.get("/api/albums/all", { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get my albums where I'm a member
export const getMyAlbumMember = async (params?: {
  per_page?: number;
  page?: number;
  query?: string;
  order_key?: string;
  order_type?: string;
  media_id?: string;
}) => {
  try {
    const res = await apiClient.get("/api/albums/my-album-member", { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Remove medias from album
export const removeMediasFromAlbum = async (data: {
  album_id: string;
  medias_id: string[];
}) => {
  try {
    const res = await apiClient.delete("/api/albums/remove-medias", { data });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Invite user to album
export const inviteUserToAlbum = async (albumId: string, userId: string) => {
  try {
    const res = await apiClient.post(`/api/albums/${albumId}/invite/${userId}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Accept album invitation
export const acceptAlbumInvitation = async (albumId: string) => {
  try {
    const res = await apiClient.post(
      `/api/albums/${albumId}/accept-invitation`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Reject album invitation
export const rejectAlbumInvitation = async (albumId: string) => {
  try {
    const res = await apiClient.post(
      `/api/albums/${albumId}/reject-invitation`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get users in an album
export const getUsersInAlbum = async (
  albumId: string,
  params?: {
    query?: string;
    order_key?: string;
    order_type?: string;
    per_page?: number;
    page?: number;
  }
) => {
  try {
    const res = await apiClient.get(`/api/albums/${albumId}/users`, { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Update member role in album
export const updateMemberRole = async (
  albumId: string,
  userId: string,
  data: {
    role: typeof ALBUM_ROLES.VIEW | typeof ALBUM_ROLES.EDIT;
  }
) => {
  try {
    const res = await apiClient.put(
      `/api/albums/${albumId}/members/${userId}`,
      data
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Remove member from album
export const removeMemberFromAlbum = async (
  albumId: string,
  userId: string
) => {
  try {
    const res = await apiClient.delete(
      `/api/albums/${albumId}/members/${userId}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
