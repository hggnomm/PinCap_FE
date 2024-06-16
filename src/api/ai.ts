import apiClient from './apiClient';

// Example API function to fetch user data
export const createAIImage = async (data: any) => {
  try {
    const response = await apiClient.post("/api/medias/createAI/image", data);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error('Tạo k được:', error);
    throw error;
  }
};
