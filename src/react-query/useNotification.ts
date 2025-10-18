import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as notifications from '@/api/notifications';

export const useNotification = () => {
  const queryClient = useQueryClient();

  const getMyNotifications = (page = 1, perPage = 20, filters?: {
    notification_type?: string;
    is_read?: number;
  }, options?: {
    enabled?: boolean;
  }) => {
    return useQuery({
      queryKey: ['notifications', page, perPage, filters],
      queryFn: () => notifications.getMyNotifications(page, perPage, filters),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes - keep cache longer
      refetchOnWindowFocus: false, // Don't refetch when window focus
      refetchOnMount: false, // Don't refetch on mount if data exists
      enabled: options?.enabled !== false, // Allow manual control
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

  const deleteNotification = useMutation({
    mutationFn: (notificationId: string) => notifications.deleteNotification(notificationId),
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
    deleteNotification: deleteNotification.mutate,
    deleteNotificationLoading: deleteNotification.isPending,
  };
};
