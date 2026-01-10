import React, { useEffect, useRef, useState } from "react";

import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";

import {
  BellOutlined,
  LoadingOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import { NOTIFICATION_STATUS } from "@/constants/constants";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationById,
  setPage,
  selectNotifications,
  selectUnreadCount,
  selectIsLoading,
  selectHasMore,
  selectIsInitialized,
  selectIsMarkingAllRead,
  selectNotificationState,
} from "@/store/notificationSlice";
import { AppDispatch } from "@/store/store";

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

  return { ref, isComponentVisible, setIsComponentVisible };
};

const Notification = () => {
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const isLoading = useSelector(selectIsLoading);
  const hasMore = useSelector(selectHasMore);
  const isInitialized = useSelector(selectIsInitialized);
  const isMarkingAllRead = useSelector(selectIsMarkingAllRead);
  const { page, perPage, error } = useSelector(selectNotificationState);

  const onShowDropdown = () => {
    if (!isComponentVisible) {
      setIsComponentVisible(true);

      // Only fetch if not initialized yet (as a fallback)
      // Main initialization happens in useInitializeNotifications hook
      if (!isInitialized) {
        dispatch(
          fetchNotifications({
            page: 1,
            perPage,
            filters: { is_read: NOTIFICATION_STATUS.UNREAD },
          })
        );
      }
    } else {
      setIsComponentVisible(false);
    }
  };

  const fetchMoreData = () => {
    if (hasMore && !isLoading && notifications.length > 0) {
      const nextPage = page + 1;
      dispatch(setPage(nextPage));
      dispatch(
        fetchNotifications({
          page: nextPage,
          perPage,
          filters: { is_read: NOTIFICATION_STATUS.UNREAD },
        })
      );
    }
  };

  const handleMarkAsRead = (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    dispatch(markNotificationAsRead(notificationId));
    // Don't refetch immediately - keep the notification in the list
    // It will be filtered out on next auto-refresh, but user can still see it
  };

  const handleMarkAllAsRead = async (event: React.MouseEvent) => {
    event.stopPropagation();

    // Dispatch mark all as read action
    await dispatch(markAllNotificationsAsRead());

    // Refetch notifications after 1 second (all will be marked as read, so empty list)
    setTimeout(() => {
      dispatch(
        fetchNotifications({
          page: 1,
          perPage,
          filters: { is_read: NOTIFICATION_STATUS.UNREAD },
        })
      );
    }, 1000);
  };

  const handleDeleteNotification = (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    dispatch(deleteNotificationById(notificationId));
  };

  // Auto-refresh notifications every 5 seconds
  // Only refresh if dropdown is visible to avoid unnecessary API calls
  useEffect(() => {
    // Set up interval to fetch notifications every 5 seconds
    const intervalId = setInterval(() => {
      dispatch(
        fetchNotifications({
          page: 1,
          perPage,
          filters: { is_read: NOTIFICATION_STATUS.UNREAD },
        })
      );
    }, 5000); // 5 seconds

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, perPage, isComponentVisible]);

  return (
    <>
      <div className="relative flex cursor-pointer" ref={ref}>
        <div onClick={onShowDropdown}>
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-auto min-w-[20px] px-1 flex justify-center items-center font-medium">
              {unreadCount}
            </div>
          )}
          <BellOutlined className="text-2xl text-blue-500" />
        </div>

        {isComponentVisible && (
          <div
            id="scrollableDiv"
            className="absolute z-50 top-10 right-0 max-h-96 w-96 border border-gray-200 rounded-lg bg-white shadow-xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#c1c1c1 #f1f1f1",
            }}
          >
            {error && (
              <p className="text-gray-600 font-bold text-sm text-center min-w-64 mt-4 mr-4">
                Error loading notifications
              </p>
            )}
            {!error && (
              <InfiniteScroll
                dataLength={notifications.length}
                next={fetchMoreData}
                hasMore={hasMore && !isLoading}
                loader={
                  <div className="flex justify-center items-center py-2">
                    <LoadingOutlined />
                  </div>
                }
                endMessage={
                  <div className="text-center py-2 text-xs text-gray-500">
                    {notifications.length > 0 && "No more notifications"}
                  </div>
                }
                height={400}
                style={{
                  overflow: "auto",
                  paddingRight: "0px",
                  marginRight: "0px",
                }}
              >
                {notifications.length === 0 && !isLoading && isInitialized ? (
                  <div className="text-gray-600 font-bold text-sm text-center min-w-64 mt-4 mr-4">
                    Empty notifications
                  </div>
                ) : (
                  <>
                    {notifications.length > 0 && (
                      <div className="flex justify-between items-center p-3 border-b border-gray-100">
                        <h3 className="text-gray-800 font-semibold text-lg ml-2">
                          Notifications
                        </h3>
                        <button
                          onClick={handleMarkAllAsRead}
                          disabled={isMarkingAllRead}
                          className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                            isMarkingAllRead
                              ? "!bg-green-500 scale-105"
                              : "!bg-blue-500 hover:!bg-blue-600"
                          }`}
                        >
                          <CheckOutlined
                            className={`text-xs transition-transform duration-300 ${
                              isMarkingAllRead ? "animate-bounce scale-125" : ""
                            }`}
                          />
                          <span className="text-white">
                            {isMarkingAllRead ? "Marked!" : "Mark all as read"}
                          </span>
                        </button>
                      </div>
                    )}

                    {notifications.map((item: any, index: number) => (
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
