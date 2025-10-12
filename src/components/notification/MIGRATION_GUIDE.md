# 🔄 Notification Migration Guide

## Quick Start

### Old Way (Component State)
```tsx
import { useNotification } from "@/hooks";

const MyComponent = () => {
  const notificationHook = useNotification();
  const { data, isLoading } = notificationHook.getMyNotifications(1, 10);
  
  // Local state management
  const [notifications, setNotifications] = useState([]);
  
  return <div>...</div>;
};
```

### New Way (Redux Store) ✅
```tsx
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchNotifications, 
  selectNotifications, 
  selectIsLoading 
} from '@/store/notificationSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const isLoading = useSelector(selectIsLoading);
  
  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, perPage: 10 }));
  }, [dispatch]);
  
  return <div>...</div>;
};
```

---

## Common Operations

### 1. Fetch Notifications
```tsx
// Old
const { data } = notificationHook.getMyNotifications(page, perPage, filters);

// New ✅
dispatch(fetchNotifications({ page, perPage, filters }));
const notifications = useSelector(selectNotifications);
```

### 2. Mark as Read
```tsx
// Old
notificationHook.markAsRead(notificationId);

// New ✅
dispatch(markNotificationAsRead(notificationId));
```

### 3. Mark All as Read
```tsx
// Old
notificationHook.markAllAsRead();

// New ✅
dispatch(markAllNotificationsAsRead());
```

### 4. Delete Notification
```tsx
// Old
notificationHook.deleteNotification(notificationId);

// New ✅
dispatch(deleteNotificationById(notificationId));
```

### 5. Get Unread Count
```tsx
// Old
const [unreadCount, setUnreadCount] = useState(0);
// Manual counting...

// New ✅
const unreadCount = useSelector(selectUnreadCount);
```

---

## Available Selectors

```tsx
import {
  selectNotifications,        // All notifications
  selectUnreadCount,          // Unread count
  selectIsLoading,            // Loading state
  selectHasMore,              // Has more pages
  selectIsInitialized,        // First fetch done
  selectIsMarkingAllRead,     // Marking all state
  selectNotificationState,    // Entire state
} from '@/store/notificationSlice';
```

---

## Migration Checklist

- [ ] Import Redux hooks (`useDispatch`, `useSelector`)
- [ ] Import actions from `@/store/notificationSlice`
- [ ] Replace `useNotification` with Redux dispatch
- [ ] Replace local state with Redux selectors
- [ ] Update event handlers to dispatch actions
- [ ] Remove unused imports
- [ ] Test functionality

---

## Benefits of Migration

✅ **Global State** - Access from anywhere  
✅ **Better Performance** - Optimized re-renders  
✅ **Realtime Ready** - Easy WebSocket integration  
✅ **Type Safe** - Full TypeScript support  
✅ **Debuggable** - Redux DevTools  

---

## Need Help?

- Check `NOTIFICATION_STORE_README.md` for full documentation
- See `NotificationExample.tsx` for examples
- Review `src/components/notification/index.tsx` for reference

