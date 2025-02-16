import { Media } from "type";
import apiClient from "./apiClient";

export const getAllMedias = async ({
  pageParam = 1,
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
  is_created: number;
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

export const createMedia = async (request: any) => {
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

export const updatedMedia = async (mediaId: string, request: any) => {
  try {
    const res = await apiClient.put(`/api/medias/${mediaId}`, request);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getDetailMedia = async (id: any) => {
  try {
    const res = await apiClient.get(`/api/medias/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const mediaReactions = async (request: any) => {
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
