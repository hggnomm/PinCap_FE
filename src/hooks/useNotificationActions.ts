import { useState } from 'react';
import { useAlbum } from './useAlbum';

export const useNotificationActions = () => {
  const albumHook = useAlbum();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionCompleted, setActionCompleted] = useState<string | null>(null);

  const handleAcceptAlbumInvitation = async (
    albumId: string,
    onSuccess?: () => void
  ) => {
    setActionLoading('accept');
    try {
      await albumHook.acceptAlbumInvitation(albumId);
      setActionCompleted('accepted');
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectAlbumInvitation = async (
    albumId: string,
    onSuccess?: () => void
  ) => {
    setActionLoading('reject');
    try {
      await albumHook.rejectAlbumInvitation(albumId);
      setActionCompleted('rejected');
      onSuccess?.();
      return true;
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const resetActions = () => {
    setActionLoading(null);
    setActionCompleted(null);
  };

  return {
    actionLoading,
    actionCompleted,
    handleAcceptAlbumInvitation,
    handleRejectAlbumInvitation,
    resetActions,
  };
};

