import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as album from '@/api/album';
import { CreateAlbumFormData, UpdateAlbumFormData } from '@/validation';

export const useAlbum = () => {
  const queryClient = useQueryClient();

  const getAlbumList = (mediaId?: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: mediaId ? ['albums', mediaId] : ['albums'],
      queryFn: () => album.getMyAlbumData(mediaId ? { media_id: mediaId } : undefined),
      staleTime: 5 * 60 * 1000,
      enabled: enabled,
    });
  };

  const getAlbumMemberList = (mediaId?: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: mediaId ? ['album-members', mediaId] : ['album-members'],
      queryFn: () => album.getMyAlbumMember(mediaId ? { media_id: mediaId } : undefined),
      staleTime: 5 * 60 * 1000,
      enabled: enabled,
    });
  };

  const getAlbumById = (id: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['album', id],
      queryFn: () => album.getDetailAlbum(id),
      enabled: !!id && enabled,
      staleTime: 5 * 60 * 1000,
    });
  };

  const createAlbumMutation = useMutation({
    mutationFn: (data: CreateAlbumFormData) => album.createMyAlbum(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['album-members'] });
    },
  });

  const updateAlbumMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAlbumFormData }) =>
      album.updateMyAlbum(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['album-members'] });
      queryClient.invalidateQueries({ queryKey: ['album', id] });
    },
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: (id: string) => album.deleteMyAlbum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['album-members'] });
    },
  });

  const removeMediasFromAlbumMutation = useMutation({
    mutationFn: (data: { album_id: string; medias_id: string[] }) =>
      album.removeMediasFromAlbum(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['album', variables.album_id] });
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  const inviteUserToAlbumMutation = useMutation({
    mutationFn: ({ albumId, userId }: { albumId: string; userId: string }) =>
      album.inviteUserToAlbum(albumId, userId),
    onSuccess: (_, { albumId }) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['album-members'] });
      queryClient.invalidateQueries({ queryKey: ['album', albumId] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const acceptAlbumInvitationMutation = useMutation({
    mutationFn: (albumId: string) => album.acceptAlbumInvitation(albumId),
    onSuccess: (_, albumId) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['album-members'] });
      queryClient.invalidateQueries({ queryKey: ['album', albumId] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const rejectAlbumInvitationMutation = useMutation({
    mutationFn: (albumId: string) => album.rejectAlbumInvitation(albumId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    getAlbumList,
    getAlbumMemberList,
    getAlbumById,
    createAlbum: createAlbumMutation.mutateAsync,
    createAlbumLoading: createAlbumMutation.isPending,
    createAlbumError: createAlbumMutation.error,
    updateAlbum: updateAlbumMutation.mutateAsync,
    updateAlbumLoading: updateAlbumMutation.isPending,
    updateAlbumError: updateAlbumMutation.error,
    deleteAlbum: deleteAlbumMutation.mutateAsync,
    deleteAlbumLoading: deleteAlbumMutation.isPending,
    deleteAlbumError: deleteAlbumMutation.error,
    removeMediasFromAlbum: removeMediasFromAlbumMutation.mutateAsync,
    removeMediasFromAlbumLoading: removeMediasFromAlbumMutation.isPending,
    removeMediasFromAlbumError: removeMediasFromAlbumMutation.error,
    inviteUserToAlbum: inviteUserToAlbumMutation.mutateAsync,
    acceptAlbumInvitation: acceptAlbumInvitationMutation.mutateAsync,
    acceptAlbumInvitationLoading: acceptAlbumInvitationMutation.isPending,
    rejectAlbumInvitation: rejectAlbumInvitationMutation.mutateAsync,
    rejectAlbumInvitationLoading: rejectAlbumInvitationMutation.isPending,
  };
};
