import apiClient from "./apiClient"; // Đường dẫn tới tệp apiClient

export const getAllMedias = async (page: number) => {
  try {
    const res = await apiClient.get("/api/medias/all", {
      params: {
        per_page: 10,
        page, // Dynamic page
      },
    });
    return res.data;
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

export const getDetailMedia = async (id: any) => {
  try {
    const res = await apiClient.get(`/api/medias/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
