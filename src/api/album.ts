import apiClient from "./apiClient"; // Đường dẫn tới tệp apiClient

export const getMyAlbumData = async () => {
  try {
    const res = await apiClient.get("/api/albums/my-album", {
      params: {
        per_page: 10,
        page: 1,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getDetailAlbum = async (albumId: string) => {
  try {
    const res = await apiClient.get(`/api/albums/${albumId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createMyAlbum = async (request: any) => {
  try {
    const res = await apiClient.post("/api/albums", request);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateMyAlbum = async (albumId: string, request: any) => {
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
    return error;
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