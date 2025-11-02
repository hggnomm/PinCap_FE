import { addNotification, Notification } from "@/store/notificationSlice";
import { store } from "@/store/store";

/**
 * Helper function to add realtime notification
 * This can be called from WebSocket/Socket.io listeners
 *
 * Example usage with Socket.io:
 * ```
 * socket.on('notification', (data) => {
 *   handleRealtimeNotification(data);
 * });
 * ```
 */
export const handleRealtimeNotification = (notification: Notification) => {
  store.dispatch(addNotification(notification));

  // Optional: Show browser notification if permission granted
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("New Notification", {
      body: notification.message,
      icon: "/placeholder-logo.png",
      badge: "/placeholder-logo.png",
    });
  }
};

/**
 * Request browser notification permission
 */
export const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return Notification.permission === "granted";
};

/**
 * Initialize WebSocket/Socket.io connection for realtime notifications
 * This is a placeholder - implement based on your backend setup
 *
 * Example with Socket.io:
 * ```
 * import io from 'socket.io-client';
 *
 * export const initializeNotificationSocket = (userId: string, token: string) => {
 *   const socket = io('YOUR_SOCKET_URL', {
 *     auth: { token },
 *     query: { userId }
 *   });
 *
 *   socket.on('connect', () => {
 *     console.log('Notification socket connected');
 *   });
 *
 *   socket.on('notification', (notification) => {
 *     handleRealtimeNotification(notification);
 *   });
 *
 *   socket.on('disconnect', () => {
 *     console.log('Notification socket disconnected');
 *   });
 *
 *   return socket;
 * };
 * ```
 */
export const initializeNotificationSocket = (userId: string, token: string) => {
  // TODO: Implement WebSocket/Socket.io connection
  console.log("Initialize notification socket for user:", userId);
  // Return socket instance for cleanup
  return null;
};

/**
 * Disconnect notification socket
 */
export const disconnectNotificationSocket = (socket: any) => {
  if (socket) {
    socket.disconnect();
  }
};
