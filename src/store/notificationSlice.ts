import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as notificationAPI from '@/api/notifications';
import { RootState } from './store';

// Types
export interface Notification {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  data?: any;
  sender?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  isMarkingAllRead: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  total: 0,
  page: 1,
  perPage: 10,
  hasMore: true,
  isLoading: false,
  isInitialized: false,
  error: null,
  isMarkingAllRead: false,
};

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (params: { page: number; perPage: number; filters?: { is_read?: number } }, { rejectWithValue }) => {
    try {
      const response = await notificationAPI.getMyNotifications(params.page, params.perPage, params.filters);
      return {
        data: response.data || [],
        total: response.total || 0,
        page: params.page,
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationAPI.markAllAsRead();
      return true;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotificationById = createAsyncThunk(
  'notifications/delete',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to delete notification');
    }
  }
);

// Slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // For realtime notification (WebSocket/Socket.io)
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Add to beginning of array
      state.notifications.unshift(action.payload);
      if (!action.payload.is_read) {
        state.unreadCount += 1;
      }
      state.total += 1;
    },
    
    // Update notification
    updateNotification: (state, action: PayloadAction<Partial<Notification> & { id: string }>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        state.notifications[index] = { ...state.notifications[index], ...action.payload };
      }
    },
    
    // Reset state
    resetNotifications: (state) => {
      state.notifications = [];
      state.page = 1;
      state.hasMore = true;
      state.isInitialized = false;
      state.error = null;
    },
    
    // Set page
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        
        if (action.payload.page === 1) {
          // Replace notifications on first page
          state.notifications = action.payload.data;
          state.unreadCount = action.payload.total;
        } else {
          // Append notifications on subsequent pages, avoiding duplicates
          const newNotifications = action.payload.data.filter(
            (newItem: Notification) => !state.notifications.some(existing => existing.id === newItem.id)
          );
          state.notifications = [...state.notifications, ...newNotifications];
        }
        
        state.total = action.payload.total;
        state.page = action.payload.page;
        
        // Check if there are more notifications
        const totalLoaded = action.payload.page * state.perPage;
        state.hasMore = totalLoaded < action.payload.total;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Mark as read
    builder
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.is_read) {
          notification.is_read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
    
    // Mark all as read
    builder
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.isMarkingAllRead = true;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.isMarkingAllRead = false;
        state.notifications = state.notifications.map(n => ({ ...n, is_read: true }));
        state.unreadCount = 0;
        
        // Clear notifications since we're filtering by unread only
        // The component will refetch if needed
        state.notifications = [];
        state.isInitialized = false;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state) => {
        state.isMarkingAllRead = false;
      });
    
    // Delete notification
    builder
      .addCase(deleteNotificationById.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.is_read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

// Actions
export const {
  addNotification,
  updateNotification,
  resetNotifications,
  setPage,
  clearError,
} = notificationSlice.actions;

// Selectors
export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnreadCount = (state: RootState) => state.notifications.unreadCount;
export const selectNotificationState = (state: RootState) => state.notifications;
export const selectIsLoading = (state: RootState) => state.notifications.isLoading;
export const selectHasMore = (state: RootState) => state.notifications.hasMore;
export const selectIsInitialized = (state: RootState) => state.notifications.isInitialized;
export const selectIsMarkingAllRead = (state: RootState) => state.notifications.isMarkingAllRead;

export default notificationSlice.reducer;

