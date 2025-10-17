import apiClient from './apiClient';
import type { User } from '@/types/type';

export const getMyProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get('/api/users/my-profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMyProfile = async (data: any) => {
  try {
    const isFormData = data instanceof FormData;
    const response = await apiClient.post('/api/users/my-profile', data, {
      headers: isFormData ? {
        'Content-Type': 'multipart/form-data',
      } : undefined,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRelationships = async (relationship: 'followers' | 'followees') => {
  try {
    const response = await apiClient.get('/api/users/relationships', {
      params: { relationship }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const followOrBlockUser = async (data: { followeeId: string; status: 'FOLLOWING' | 'BLOCK' }) => {
  try {
    const response = await apiClient.post('/api/users/relationships', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unfollowOrUnblockUser = async (data: { followeeId: string; status: 'FOLLOWING' | 'BLOCK' }) => {
  try {
    const response = await apiClient.delete('/api/users/relationships', { data });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/api/users/profiles/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserRelationships = async (userId: string, relationship: 'followers' | 'followees') => {
  try {
    const response = await apiClient.get(`/api/users/relationships/${userId}`, {
      params: { relationship }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchUsers = async (target: string) => {
  try {
    const response = await apiClient.get('/api/users/search', {
      params: { target }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const findUsers = async (target: string, albumId?: string | null) => {
  try {
    const response = await apiClient.get('/api/users/find', {
      params: { target, album_id: albumId }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReportReasons = async () => {
  try {
    const response = await apiClient.get('/api/users/report-reasons');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reportUser = async (data: { user_id: string; reason_report_id?: string; other_reasons?: string }) => {
  try {
    const response = await apiClient.post('/api/users/report', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
