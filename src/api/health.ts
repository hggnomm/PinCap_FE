import apiClient from './apiClient';

// Health check endpoint
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/api/health-check');
    return response.data;
  } catch (error) {
    throw error;
  }
};
