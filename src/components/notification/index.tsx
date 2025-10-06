import React, { useEffect, useRef, useState, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BellOutlined, LoadingOutlined, CheckOutlined } from '@ant-design/icons';
import { useNotification } from "../../hooks";
import NotificationItem from "./NotificationItem";

const useComponentVisible = (initialIsVisible: boolean) => {
  const ref = useRef<any>(null);
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);

  const handleHideDropdown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsComponentVisible(false);
    }
  };

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible, handleClickOutside };
};

const Notification = () => {
  const { ref, isComponentVisible, setIsComponentVisible, handleClickOutside } =
    useComponentVisible(false);

  const notificationHook = useNotification();
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [enabledFetch, setEnabledFetch] = useState(false);

  // Get notifications using the hook with enabled control
  const { data: notificationData, isLoading, error, refetch } = notificationHook.getMyNotifications(
    page, 
    perPage, 
    {is_read: 0},
    { enabled: enabledFetch }
  );

  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  // Cache notifications data với useMemo
  const cachedNotifications = useMemo(() => {
    return allNotifications;
  }, [allNotifications]);

  // Update notifications when data changes
  useEffect(() => {
    if (notificationData?.data && Array.isArray(notificationData.data)) {
      if (page === 1) {
        setAllNotifications(notificationData.data);
        setIsInitialized(true);
        // Only update total count on first load or when explicitly refreshing
        if (notificationData.total !== undefined) {
          setTotalUnreadCount(notificationData.total);
        }
      } else if (isInitialized) {
        setAllNotifications(prev => {
          // Avoid duplicates
          const newItems = notificationData.data.filter(
            (newItem: any) => !prev.some((existingItem: any) => existingItem.id === newItem.id)
          );
          return [...prev, ...newItems];
        });
      }
      console.log("notificationData", notificationData.data);
      // Check if there are more notifications to load
      const totalLoaded = page * perPage;
      setHasMore(totalLoaded < (notificationData.total || 0));
    }
    console.log("notificationData", notificationData);
  }, [notificationData, page, perPage, isInitialized]);

  const onShowDropdown = () => {
    console.log("test");
    if (!isComponentVisible) {
      setIsComponentVisible(true);
      
      // Chỉ fetch khi chưa có data trong cache
      if (allNotifications.length === 0) {
        setPage(1);
        setIsInitialized(false);
        setEnabledFetch(true); // Enable fetch
      }
    } else {
      setIsComponentVisible(false);
    }
  };

  const fetchMoreData = () => {
    if (hasMore && !isLoading && cachedNotifications.length > 0) {
      setEnabledFetch(true); // Enable fetch for next page
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleMarkAsRead = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdown from closing
    
    // Find the notification and check if it's unread
    const notification = allNotifications.find(item => item.id === notificationId);
    if (notification && !notification.is_read) {
      // Decrease total count by 1
      setTotalUnreadCount(prev => Math.max(0, prev - 1));
      
      // Update the notification in local state
      setAllNotifications(prev => 
        prev.map(item => 
          item.id === notificationId 
            ? { ...item, is_read: true }
            : item
        )
      );
    }
    
    notificationHook.markAsRead(notificationId);
  };

  const handleMarkAllAsRead = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdown from closing
    
    // Start animation
    setIsMarkingAllRead(true);
    
    // Update total count
    setTotalUnreadCount(0);
    
    // Mark all as read in local state
    setAllNotifications(prev => 
      prev.map(item => ({ ...item, is_read: true }))
    );
    
    notificationHook.markAllAsRead();
    
    // Stop animation and clear cache sau 1 giây
    setTimeout(() => {
      setIsMarkingAllRead(false);
      // Clear cache để refetch lần sau (vì filter is_read: 0 sẽ không còn notifications)
      setAllNotifications([]);
      setIsInitialized(false);
    }, 1000);
  };

  const handleDeleteNotification = (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent dropdown from closing
    
    // Find the notification and check if it's unread
    const notification = allNotifications.find(item => item.id === notificationId);
    if (notification && !notification.is_read) {
      // Decrease total count by 1 if it was unread
      setTotalUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    // Remove from local state
    setAllNotifications(prev => prev.filter(item => item.id !== notificationId));
    
    // Call API to delete notification
    notificationHook.deleteNotification(notificationId);
  };
  return (
    <>
      <div className="relative flex cursor-pointer">
        <div onClick={onShowDropdown}>
        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-auto min-w-5 px-1 flex justify-center items-center font-medium">
          {totalUnreadCount}
        </div>
        <BellOutlined className="text-2xl text-blue-500" />
      </div>

      {isComponentVisible && (
        <div 
          id="scrollableDiv" 
          className="absolute z-50 top-10 right-0 max-h-96 w-96 border border-gray-200 rounded-lg bg-white shadow-xl overflow-auto"
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#c1c1c1 #f1f1f1'
          }}
        >
            {error && (
              <p className="text-gray-600 font-bold text-sm text-center min-w-64 mt-4 mr-4">
                Error loading notifications
              </p>
            )}
            {!error && (
              <InfiniteScroll
                dataLength={cachedNotifications.length}
                next={fetchMoreData}
                hasMore={hasMore && !isLoading}
                loader={
                  <div className="flex justify-center items-center py-2">
                    <LoadingOutlined />
                  </div>
                }
                endMessage={
                  <div className="text-center py-2 text-xs text-gray-500">
                    {cachedNotifications.length > 0 && 'No more notifications'}
                  </div>
                }
                height={400}
                style={{ 
                  overflow: 'auto',
                  paddingRight: '0px',
                  marginRight: '0px'
                }}
              >
                {cachedNotifications.length === 0 && !isLoading && isInitialized ? (
                  <div className="text-gray-600 font-bold text-sm text-center min-w-64 mt-4 mr-4">
                    "Empty notifications"
                  </div>
                ) : (
                  <>
                    {cachedNotifications?.length > 0 && (
                      <div className="flex justify-between items-center p-3 border-b border-gray-100">
                        <h3 className="text-gray-800 font-semibold text-lg ml-2">Notifications</h3>
                        <button 
                          onClick={(e) => handleMarkAllAsRead(e)} 
                          disabled={isMarkingAllRead}
                          className={`flex items-center gap-2 px-4 py-2 text-blue-500 text-sm font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                            isMarkingAllRead 
                              ? 'bg-green-500 scale-105' 
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          <CheckOutlined 
                            className={`text-xs transition-transform duration-300 ${
                              isMarkingAllRead ? 'animate-bounce scale-125' : ''
                            }`} 
                          />
                          {isMarkingAllRead ? 'Marked!' : 'Mark all as read'}
                        </button>
                      </div>
                    )}

                    {cachedNotifications?.map((item: any, index: number) => (
                      <NotificationItem
                        key={item.id || index}
                        notification={item}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDeleteNotification}
                      />
                    ))}
                  </>
                )}
              </InfiniteScroll>
            )}
        </div>
      )}
      </div>
    </>
  );
};

export default Notification;
