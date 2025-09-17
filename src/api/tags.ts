import apiClient from './apiClient';

// Get top 10 tags with most medias
export const getTopTags = async () => {
  try {
    const response = await apiClient.get('/api/tags');
    return response.data;
  } catch (error) {
    throw error;
  }
};
