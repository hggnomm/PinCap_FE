import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notifications from '@/api/notifications';

export const useNotification = () => {
  const queryClient = useQueryClient();

  const getMyNotifications = (page = 1, perPage = 20, filters?: {
    notification_type?: string;
    is_read?: number;
  }) => {
    return useQuery({
      queryKey: ['notifications', page, perPage, filters],
      queryFn: () => notifications.getMyNotifications(page, perPage, filters),
      staleTime: 2 * 60 * 1000, // 2 minutes for notifications
    });
  };

  const markAsRead = useMutation({
    mutationFn: (notificationId: string) => notifications.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: () => notifications.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    getMyNotifications,
    markAsRead: markAsRead.mutate,
    markAsReadLoading: markAsRead.isPending,
    markAllAsRead: markAllAsRead.mutate,
    markAllAsReadLoading: markAllAsRead.isPending,
  };
};
