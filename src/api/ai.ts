import apiClient from "./apiClient";

export const createAIImage = async (data: any) => {
  try {
    const response = await apiClient.post("/api/medias/ai", data);
    return response.data;
  } catch (error) {
    console.error("Tạo không được:", error);
    throw error;
  }
};
