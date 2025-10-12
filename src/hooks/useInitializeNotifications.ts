import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { 
  fetchNotifications, 
  resetNotifications,
  selectIsInitialized 
} from '@/store/notificationSlice';
import { NOTIFICATION_STATUS } from '@/constants/constants';

/**
 * Hook to initialize notifications when user is authenticated
 * This should be called once at the app level (e.g., in App.tsx or HeaderCommon)
 * 
 * Features:
 * - Auto-fetch notifications on mount if not initialized
 * - Fetch unread notifications only
 * - Store in Redux global store
 * - No need to click notification icon to fetch
 * - Auto-clear notifications when user logs out
 */
export const useInitializeNotifications = (isAuthenticated: boolean) => {
  const dispatch = useDispatch<AppDispatch>();
  const isInitialized = useSelector(selectIsInitialized);

  useEffect(() => {
    if (isAuthenticated && !isInitialized) {
      // Fetch notifications when user is authenticated
      dispatch(fetchNotifications({
        page: 1,
        perPage: 10,
        filters: { is_read: NOTIFICATION_STATUS.UNREAD }
      }));
    } else if (!isAuthenticated && isInitialized) {
      // Clear notifications when user logs out
      dispatch(resetNotifications());
    }
  }, [isAuthenticated, isInitialized, dispatch]);
};

