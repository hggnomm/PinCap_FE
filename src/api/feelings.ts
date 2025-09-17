import apiClient from './apiClient';

// Get all feelings
export const getAllFeelings = async () => {
  try {
    const response = await apiClient.get('/api/feelings');
    return response.data;
  } catch (error) {
    throw error;
  }
};
