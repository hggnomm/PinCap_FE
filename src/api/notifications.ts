import apiClient from './apiClient';

export const getMyNotifications = async (page = 1, perPage = 20, filters?: {
  notification_type?: string;
  is_read?: number;
}) => {
  try {
    const params: any = { page, per_page: perPage };
    if (filters?.notification_type) params.notification_type = filters.notification_type;
    if (filters?.is_read !== undefined) params.is_read = filters.is_read;

    const response = await apiClient.get('/api/notifications/me', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsRead = async (notificationId: string) => {
  try {
    const response = await apiClient.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAllAsRead = async () => {
  try {
    const response = await apiClient.put('/api/notifications/mark-all-read');
    return response.data;
  } catch (error) {
    throw error;
  }
};
