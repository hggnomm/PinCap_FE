/**
 * EXAMPLE: How to use Notification System
 * This file shows various use cases for the notification system
 * DO NOT import this file in production - it's for reference only
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store/store';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
  addNotification,
  selectNotifications,
  selectUnreadCount,
  selectIsLoading,
  selectHasMore,
} from '@/store/notificationSlice';

// Example 1: Basic notification display
export const BasicNotificationExample = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    // Fetch first page of unread notifications
    dispatch(fetchNotifications({ 
      page: 1, 
      perPage: 10, 
      filters: { is_read: 0 } 
    }));
  }, [dispatch]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Notifications ({unreadCount} unread)
      </h2>
      
      {isLoading && <p>Loading...</p>}
      
      <div className="space-y-2">
        {notifications.map(notif => (
          <div 
            key={notif.id}
            className={`p-3 rounded ${notif.is_read ? 'bg-gray-100' : 'bg-blue-50'}`}
          >
            <p>{notif.message}</p>
            <small>{new Date(notif.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 2: Notification with actions
export const NotificationWithActionsExample = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectNotifications);

  const handleMarkAsRead = (id: string) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteNotificationById(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notifications</h2>
        <button 
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Mark All as Read
        </button>
      </div>
      
      <div className="space-y-2">
        {notifications.map(notif => (
          <div 
            key={notif.id}
            className="p-3 border rounded flex justify-between items-start"
          >
            <div className="flex-1">
              <p className="font-medium">{notif.message}</p>
              <small className="text-gray-500">
                {new Date(notif.created_at).toLocaleString()}
              </small>
            </div>
            
            <div className="flex gap-2">
              {!notif.is_read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Mark Read
                </button>
              )}
              <button
                onClick={() => handleDelete(notif.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 3: Infinite scroll notifications
export const InfiniteScrollNotificationExample = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectNotifications);
  const hasMore = useSelector(selectHasMore);
  const isLoading = useSelector(selectIsLoading);
  
  const [page, setPage] = React.useState(1);

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, perPage: 10 }));
  }, [dispatch]);

  const loadMore = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(fetchNotifications({ page: nextPage, perPage: 10 }));
    }
  };

  return (
    <div className="p-4 max-h-screen overflow-auto">
      <h2 className="text-xl font-bold mb-4">Infinite Scroll Notifications</h2>
      
      <div className="space-y-2">
        {notifications.map(notif => (
          <div key={notif.id} className="p-3 border rounded">
            <p>{notif.message}</p>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

// Example 4: Realtime notification simulation
export const RealtimeNotificationExample = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  // Simulate receiving a realtime notification
  const simulateRealtimeNotification = () => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      type: 'MEDIA_REACTION',
      message: 'Someone liked your post!',
      is_read: false,
      created_at: new Date().toISOString(),
      sender: {
        id: 'user-123',
        username: 'john_doe',
        avatar: '/placeholder-user.jpg',
      },
    };

    dispatch(addNotification(newNotification));

    // Optional: Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Notification', {
        body: newNotification.message,
        icon: '/placeholder-logo.png',
      });
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Realtime Notifications ({unreadCount})
        </h2>
        <button
          onClick={simulateRealtimeNotification}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Simulate Realtime
        </button>
      </div>
      
      <div className="space-y-2">
        {notifications.map(notif => (
          <div 
            key={notif.id}
            className={`p-3 rounded transition-all ${
              notif.is_read 
                ? 'bg-gray-100' 
                : 'bg-blue-50 border-l-4 border-blue-500'
            }`}
          >
            <div className="flex items-start gap-3">
              {notif.sender?.avatar && (
                <img 
                  src={notif.sender.avatar} 
                  alt={notif.sender.username}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{notif.message}</p>
                <small className="text-gray-500">
                  {new Date(notif.created_at).toLocaleString()}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 5: Notification badge component
export const NotificationBadgeExample = () => {
  const dispatch = useDispatch<AppDispatch>();
  const unreadCount = useSelector(selectUnreadCount);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const notifications = useSelector(selectNotifications);

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, perPage: 5, filters: { is_read: 0 } }));
  }, [dispatch]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        {/* Bell Icon */}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          
          <div className="max-h-96 overflow-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-500">No notifications</p>
            ) : (
              notifications.map(notif => (
                <div 
                  key={notif.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <p className="text-sm">{notif.message}</p>
                  <small className="text-xs text-gray-500">
                    {new Date(notif.created_at).toLocaleString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default {
  BasicNotificationExample,
  NotificationWithActionsExample,
  InfiniteScrollNotificationExample,
  RealtimeNotificationExample,
  NotificationBadgeExample,
};

