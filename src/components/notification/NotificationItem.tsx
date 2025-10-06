import React from 'react';
import { DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { NOTIFICATION_TYPES } from '@/constants/constants';
import { useNotificationActions } from '@/hooks/useNotificationActions';
import clsx from 'clsx';
import { Button } from 'antd/es';

interface NotificationItemProps {
  notification: any;
  onMarkAsRead: (id: string, event: React.MouseEvent) => void;
  onDelete: (id: string, event: React.MouseEvent) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const {
    actionLoading,
    actionCompleted,
    handleAcceptAlbumInvitation,
    handleRejectAlbumInvitation,
  } = useNotificationActions();

  // Safety check
  if (!notification) return null;

  // Extract album ID from link
  const getAlbumId = () => {
    if (!notification.link || typeof notification.link !== 'string') return null;
    const parts = notification.link.split('/albums/');
    return parts.length > 1 ? parts[1] : null;
  };

  const onAccept = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const albumId = getAlbumId();
    if (!albumId || !notification.id) return;

    await handleAcceptAlbumInvitation(albumId, () => {
      setTimeout(() => onMarkAsRead(notification.id, event), 1000);
    });
  };

  const onReject = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const albumId = getAlbumId();
    if (!albumId || !notification.id) return;

    await handleRejectAlbumInvitation(albumId, () => {
      setTimeout(() => onDelete(notification.id, event), 1000);
    });
  };

  // Render completed state
  const renderCompletedState = () => {
    if (!actionCompleted) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-2 py-2 px-3 bg-gray-100 rounded-lg">
        <span className={clsx(
          'text-sm font-medium',
          actionCompleted === 'accepted' && 'text-green-600',
          actionCompleted === 'rejected' && 'text-gray-600'
        )}>
          {actionCompleted === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
        </span>
      </div>
    );
  };

  // Render album invitation actions
  const renderAlbumInvitation = () => (
    <div className="flex items-center gap-2 mt-2">
      <Button
        type="primary"
        icon={<CheckOutlined className="text-xs" />}
        onClick={onAccept}
        disabled={!!actionLoading || notification.is_read}
        loading={actionLoading === 'accept'}
        className={clsx(
          '!flex-1 !flex !items-center !justify-center !gap-2 !h-auto !py-2 !px-3 !rounded-lg !font-medium !text-sm !transition-all !duration-200',
          actionLoading === 'accept' && '!animate-pulse',
          notification.is_read 
            ? '!bg-gray-100 !text-gray-400 !border-gray-200'
            : '!bg-green-500 !text-white hover:!bg-green-600 active:!scale-95 !border-green-500'
        )}
      >
        {actionLoading === 'accept' ? 'Accepting...' : 'Accept'}
      </Button>
      <Button
        type="primary"
        danger
        icon={<CloseOutlined className="text-xs" />}
        onClick={onReject}
        disabled={!!actionLoading || notification.is_read}
        loading={actionLoading === 'reject'}
        className={clsx(
          '!flex-1 !flex !items-center !justify-center !gap-2 !h-auto !py-2 !px-3 !rounded-lg !font-medium !text-sm !transition-all !duration-200',
          actionLoading === 'reject' && '!animate-pulse',
          notification.is_read
            ? '!bg-gray-100 !text-gray-400 !border-gray-200'
            : '!bg-red-500 !text-white hover:!bg-red-600 active:!scale-95 !border-red-500'
        )}
      >
        {actionLoading === 'reject' ? 'Rejecting...' : 'Reject'}
      </Button>
    </div>
  );

  // Render action buttons based on notification type
  const renderActionButtons = () => {
    if (actionCompleted) return renderCompletedState();

    if (!notification.notification_type) return null;

    switch (notification.notification_type) {
      case NOTIFICATION_TYPES.ALBUM_INVITATION:
        return renderAlbumInvitation();

      case NOTIFICATION_TYPES.MEDIA_CREATED:
      case NOTIFICATION_TYPES.USER_FOLLOWED:
      case NOTIFICATION_TYPES.MEDIA_REACTION:
      case NOTIFICATION_TYPES.COMMENT_REACTION:
      case NOTIFICATION_TYPES.COMMENT:
      case NOTIFICATION_TYPES.COMMENT_REPLY:
      case NOTIFICATION_TYPES.MEDIA_ADD_GROUP_ALBUM:
      default:
        return null;
    }
  };

  return (
    <div
      className={clsx(
        'flex flex-col border-b border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors duration-150',
        notification.is_read && 'opacity-50'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {notification.sender?.avatar ? (
            <img
              src={notification.sender.avatar}
              alt={notification.sender?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm border-2 border-gray-200">
              {((notification.sender?.name || notification.title || 'N').charAt(0) || 'N').toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className={clsx(
            'flex-grow min-h-0 flex flex-col',
            notification.notification_type !== NOTIFICATION_TYPES.ALBUM_INVITATION && 'cursor-pointer'
          )}
          onClick={(e) => {
            // Disable mark as read for ALBUM_INVITATION type
            if (notification.notification_type === NOTIFICATION_TYPES.ALBUM_INVITATION) {
              return;
            }
            if (notification.id) {
              onMarkAsRead(notification.id, e);
            }
          }}
        >
          <div className="flex-grow flex flex-col">
            <p className="text-gray-800 font-semibold text-sm mb-1 leading-tight line-clamp-1">
              {notification.title || 'Notification'}
            </p>
            <p className="text-gray-600 text-sm mb-2 leading-tight line-clamp-2">
              {notification.content || notification.message || ''}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-xs">
                {notification.created_at 
                  ? (() => {
                      try {
                        return new Date(notification.created_at).toLocaleString('vi-VN');
                      } catch (error) {
                        return 'Just now';
                      }
                    })()
                  : 'Just now'}
              </p>
              {!notification.is_read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>

          {/* Action Buttons based on notification type */}
          {renderActionButtons()}
        </div>

        {/* Delete Button */}
        <div className="flex-shrink-0 flex items-start mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!notification.is_read && notification.id) {
                onDelete(notification.id, e);
              }
            }}
            disabled={notification.is_read}
            className={clsx(
              'p-2 rounded-full transition-colors duration-200',
              notification.is_read
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer'
            )}
            title={notification.is_read ? 'Cannot delete read notification' : 'Delete notification'}
          >
            <DeleteOutlined className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

