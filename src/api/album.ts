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
    console.log(error);
  }
};
