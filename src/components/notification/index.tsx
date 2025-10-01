import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BellOutlined, LoadingOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import Loading from "../loading/Loading";
import { useNotification } from "../../hooks";

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

  // Get notifications using the hook
  const { data: notificationData, isLoading, error, refetch } = notificationHook.getMyNotifications(page, perPage, {is_read: 0});

  const [allNotifications, setAllNotifications] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

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
      // Reset state when opening dropdown
      setPage(1);
      setAllNotifications([]);
      setHasMore(true);
      setIsInitialized(false);
      setIsComponentVisible(true);
      refetch();
    } else {
      setIsComponentVisible(false);
    }
  };

  const fetchMoreData = () => {
    if (hasMore && !isLoading && allNotifications.length > 0) {
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
    
    // Stop animation after 1 second
    setTimeout(() => {
      setIsMarkingAllRead(false);
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
    
    // TODO: Call API to delete notification when backend supports it
    // notificationHook.deleteNotification(notificationId);
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
          className="absolute overflow-hidden z-50 top-10 right-0 max-h-96 w-96 border border-gray-200 rounded-lg bg-white shadow-xl overflow-auto"
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#c1c1c1 #f1f1f1'
          }}
        >
            {error ? (
              <p className="text-gray-600 font-bold text-sm text-center min-w-64 mt-4 mr-4">
                Error loading notifications
              </p>
            ) : (
              <InfiniteScroll
                dataLength={allNotifications.length}
                next={fetchMoreData}
                hasMore={hasMore && !isLoading}
                loader={
                  <div className="flex justify-center items-center py-2">
                    <LoadingOutlined />
                  </div>
                }
                endMessage={
                  <div className="text-center py-2 text-xs text-gray-500">
                    {allNotifications.length > 0 ? 'No more notifications' : ''}
                  </div>
                }
                height={400}
                style={{ 
                  overflow: 'auto',
                  paddingRight: '0px',
                  marginRight: '0px'
                }}
              >
                {allNotifications.length === 0 && !isLoading && isInitialized ? (
                  <div className="text-gray-600 font-bold text-sm text-center min-w-64 mt-4 mr-4">
                    "Empty notifications"
                  </div>
                ) : (
                  <>
                    {allNotifications.length > 0 && (
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

                    {allNotifications.map((item: any, index: number) => (
                      <div
                        key={item.id || index}
                        className={`flex items-center gap-3 border-b border-gray-100 px-4 hover:bg-gray-50 transition-colors duration-150 ${
                          item.is_read ? "opacity-50" : ""
                        }`}
                        style={{ height: '80px' }}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {item.sender?.avatar ? (
                            <img 
                              src={item.sender.avatar} 
                              alt={item.sender.name || 'User'} 
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm border-2 border-gray-200">
                              {(item.sender?.name || item.title || 'N').charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div 
                          className="flex-grow cursor-pointer min-h-0 flex flex-col justify-center"
                          onClick={(e) => handleMarkAsRead(item.id, e)}
                        >
                          <div className="flex-grow flex flex-col justify-center">
                            <p className="text-gray-800 font-semibold text-sm mb-1 leading-tight line-clamp-1">
                              {item.title || 'Thông báo'}
                            </p>
                            <p className="text-gray-600 text-sm mb-2 leading-tight line-clamp-2">
                              {item.content || item.message || ''}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-gray-400 text-xs">
                                {item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : 'Just now'}
                              </p>
                              {!item.is_read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="flex-shrink-0 flex items-center">
                          <button
                            onClick={(e) => !item.is_read ? handleDeleteNotification(item.id, e) : e.stopPropagation()}
                            disabled={item.is_read}
                            className={`p-2 rounded-full transition-colors duration-200 ${
                              item.is_read 
                                ? "text-gray-300 cursor-not-allowed" 
                                : "text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                            }`}
                            title={item.is_read ? "Cannot delete read notification" : "Delete notification"}
                          >
                            <DeleteOutlined className="text-sm" />
                          </button>
                        </div>
                      </div>
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
