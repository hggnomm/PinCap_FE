# Notification Store - Redux Implementation

## 📋 Overview

This notification system is built with Redux Toolkit and designed to support both REST API and realtime notifications (WebSocket/Socket.io).

## 🏗️ Architecture

### Files Structure
```
src/
├── store/
│   ├── notificationSlice.ts          # Redux slice with actions & reducers
│   └── store.ts                       # Root store configuration
├── components/
│   └── notification/
│       ├── index.tsx                  # Main notification component
│       └── NotificationItem.tsx       # Individual notification item
├── api/
│   └── notifications.ts               # API calls
└── utils/
    └── notificationHelpers.ts         # Helper functions for realtime
```

## 🚀 Features

### Current Features
- ✅ Fetch notifications with pagination
- ✅ Infinite scroll loading
- ✅ Mark single notification as read
- ✅ Mark all notifications as read
- ✅ Delete notification
- ✅ Unread count badge
- ✅ Global state management with Redux
- ✅ Optimized caching and performance

### Ready for Future
- 🔜 Realtime notifications via WebSocket/Socket.io
- 🔜 Browser push notifications
- 🔜 Sound alerts
- 🔜 Notification grouping

## 📖 Usage

### Initialize Notifications (Required)

**IMPORTANT:** Add this hook to your main component (e.g., HeaderCommon, App.tsx):

```tsx
import { useInitializeNotifications } from '@/hooks/useInitializeNotifications';

const HeaderCommon = () => {
  const { isAuthenticated } = useAuth();
  
  // Initialize notifications - fetch on login, clear on logout
  useInitializeNotifications(isAuthenticated);
  
  return <div>...</div>;
};
```

This will:
- ✅ Auto-fetch notifications when user logs in
- ✅ Store in Redux global store (cached)
- ✅ Auto-clear when user logs out
- ✅ No need to click notification icon to fetch

### Basic Usage in Component

```tsx
import { useSelector } from 'react-redux';
import { 
  selectNotifications,
  selectUnreadCount 
} from '@/store/notificationSlice';

const MyComponent = () => {
  // Just read from Redux store - already initialized!
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {notifications.map(notif => (
        <div key={notif.id}>{notif.message}</div>
      ))}
    </div>
  );
};
```

### Available Selectors

```tsx
import {
  selectNotifications,        // Get all notifications
  selectUnreadCount,          // Get unread count
  selectIsLoading,            // Get loading state
  selectHasMore,              // Check if more notifications available
  selectIsInitialized,        // Check if initial fetch completed
  selectIsMarkingAllRead,     // Check if marking all as read
  selectNotificationState,    // Get entire notification state
} from '@/store/notificationSlice';
```

### Available Actions

```tsx
import {
  fetchNotifications,           // Fetch notifications from API
  markNotificationAsRead,       // Mark single as read
  markAllNotificationsAsRead,   // Mark all as read
  deleteNotificationById,       // Delete notification
  addNotification,              // Add realtime notification (for WebSocket)
  updateNotification,           // Update notification
  resetNotifications,           // Reset state
  setPage,                      // Set current page
  clearError,                   // Clear error
} from '@/store/notificationSlice';

// Usage
dispatch(fetchNotifications({ page: 1, perPage: 10 }));
dispatch(markNotificationAsRead('notification-id'));
dispatch(markAllNotificationsAsRead());
dispatch(deleteNotificationById('notification-id'));
```

## 🔌 Realtime Notifications Setup

### Step 1: Install Socket.io Client (if using Socket.io)

```bash
npm install socket.io-client
```

### Step 2: Update notificationHelpers.ts

```tsx
import io from 'socket.io-client';
import { handleRealtimeNotification } from '@/utils/notificationHelpers';

export const initializeNotificationSocket = (userId: string, token: string) => {
  const socket = io(process.env.VITE_SOCKET_URL, {
    auth: { token },
    query: { userId }
  });
  
  socket.on('connect', () => {
    console.log('✅ Notification socket connected');
  });
  
  socket.on('notification', (notification) => {
    handleRealtimeNotification(notification);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Notification socket disconnected');
  });
  
  return socket;
};
```

### Step 3: Initialize in Your App

```tsx
// src/App.tsx or similar
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { initializeNotificationSocket, disconnectNotificationSocket } from '@/utils/notificationHelpers';

const App = () => {
  const user = useSelector((state: any) => state.auth);
  
  useEffect(() => {
    if (user?.id && user?.token) {
      const socket = initializeNotificationSocket(user.id, user.token);
      
      return () => {
        disconnectNotificationSocket(socket);
      };
    }
  }, [user?.id, user?.token]);
  
  return <YourApp />;
};
```

### Step 4: Request Browser Notification Permission

```tsx
import { requestNotificationPermission } from '@/utils/notificationHelpers';

// In your component or app initialization
useEffect(() => {
  requestNotificationPermission();
}, []);
```

## 🎯 State Structure

```typescript
interface NotificationState {
  notifications: Notification[];     // Array of notifications
  unreadCount: number;               // Total unread count
  total: number;                     // Total notifications
  page: number;                      // Current page
  perPage: number;                   // Items per page
  hasMore: boolean;                  // More items available
  isLoading: boolean;                // Loading state
  isInitialized: boolean;            // First fetch completed
  error: string | null;              // Error message
  isMarkingAllRead: boolean;         // Marking all state
}
```

## 🔔 Notification Type

```typescript
interface Notification {
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
```

## 🎨 Best Practices

1. **Always use selectors** instead of accessing state directly
2. **Dispatch actions** instead of mutating state
3. **Handle errors** in components with try-catch or error selectors
4. **Optimize re-renders** by using specific selectors
5. **Clean up** WebSocket connections on unmount

## 🐛 Troubleshooting

### Notifications not updating
- Check if notifications slice is added to store
- Verify API endpoints are correct
- Check network tab for API errors

### Realtime not working
- Verify WebSocket connection is established
- Check socket.io server configuration
- Ensure authentication is working
- Check browser console for socket errors

### High memory usage
- Implement notification cleanup after certain time
- Limit maximum notifications in state
- Clear old notifications periodically

## 📝 TODO

- [ ] Add notification sound
- [ ] Add notification grouping
- [ ] Add notification filtering by type
- [ ] Add notification search
- [ ] Add notification settings (mute, frequency)
- [ ] Add notification history page
- [ ] Add notification categories
- [ ] Implement WebSocket reconnection logic
- [ ] Add offline notification queue

## 🤝 Contributing

When adding new notification features:
1. Update the slice with new actions/reducers
2. Update selectors if needed
3. Update this README
4. Add TypeScript types
5. Test thoroughly

