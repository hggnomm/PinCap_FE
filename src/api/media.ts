import { CreateMediaFormData } from "@/validation/media";

import { Media } from "type";

import apiClient from "./apiClient";

export const getAllMedias = async ({
  pageParam,
}: {
  pageParam: number;
}): Promise<Media[]> => {
  try {
    const res = await apiClient.get("/api/medias/all", {
      params: {
        per_page: 15,
        page: pageParam,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getMyMedias = async ({
  pageParam,
  is_created,
}: {
  pageParam: number;
  is_created: boolean;
}): Promise<Media[]> => {
  try {
    const res = await apiClient.get("/api/medias/my-media", {
      params: {
        per_page: 10,
        page: pageParam,
        is_created: is_created,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createMedia = async (request: CreateMediaFormData) => {
  try {
    const res = await apiClient.post("/api/medias", request, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updatedMedia = async (mediaId: string, request: CreateMediaFormData) => {
  try {
    const res = await apiClient.put(`/api/medias/${mediaId}`, request);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getDetailMedia = async (id: string, tag_flg?: boolean) => {
  try {
    const res = await apiClient.get(`/api/medias/${id}`, {
      params: {
        tag_flg: tag_flg,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const mediaReactions = async (request: {
  media_id: string;
  feeling_id: string;
}) => {
  try {
    const res = await apiClient.post(`/api/medias/reactions`, request);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteMedias = async (ids: string[]) => {
  try {
    const res = await apiClient.delete(`/api/medias`, {
      data: { ids },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Get media by user ID with pagination and filters
export const getMediasByUserId = async (params: {
  user_id: string;
  per_page?: number;
  page?: number;
  query?: string;
  order_key?: string;
  order_type?: string;
  type?: "0" | "1"; // IMAGE = 0, VIDEO = 1
}) => {
  try {
    const res = await apiClient.get("/api/medias", { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Search media
export const searchMedia = async (params: {
  search?: string;
  per_page: number;
  page: number;
}) => {
  try {
    const res = await apiClient.get("/api/medias/search", { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Download media files
export const downloadMedia = async (urls: string[]) => {
  try {
    const res = await apiClient.post("/api/medias/downloads", { urls }, {
      responseType: 'blob'
    });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Report media
export const reportMedia = async (data: {
  media_id: string;
  reason_report_id?: string;
  other_reasons?: string;
}) => {
  try {
    const res = await apiClient.post("/api/medias/report", data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get all feelings for a media
export const getMediaFeelings = async (mediaId: string) => {
  try {
    const res = await apiClient.get(`/api/medias/${mediaId}/feelings`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get users who reacted with specific feeling to a media
export const getMediaFeelingUsers = async (
  mediaId: string,
  feelingId: string,
  params?: { page?: number; per_page?: number }
) => {
  try {
    const res = await apiClient.get(`/api/medias/${mediaId}/feelings/${feelingId}`, { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Get all users who reacted to a media
export const getAllMediaFeelingUsers = async (
  mediaId: string,
  params?: { page?: number; per_page?: number }
) => {
  try {
    const res = await apiClient.get(`/api/medias/${mediaId}/feelings/users`, { params });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};