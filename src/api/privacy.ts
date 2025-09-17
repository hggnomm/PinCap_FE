import apiClient from './apiClient';

// Get privacy options
export const getPrivacyOptions = async () => {
  try {
    const response = await apiClient.get('/api/privacy');
    return response.data;
  } catch (error) {
    throw error;
  }
};
