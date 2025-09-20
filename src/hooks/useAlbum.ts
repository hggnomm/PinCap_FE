import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as album from '@/api/album';
import { CreateAlbumFormData, UpdateAlbumFormData } from '@/validation';

export const useAlbum = () => {
  const queryClient = useQueryClient();

  const getAlbumList = () => {
    return useQuery({
      queryKey: ['albums'],
      queryFn: () => album.getMyAlbumData(),
      staleTime: 5 * 60 * 1000,
    });
  };

  const getAlbumById = (id: string) => {
    return useQuery({
      queryKey: ['album', id],
      queryFn: () => album.getDetailAlbum(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  const createAlbumMutation = useMutation({
    mutationFn: (data: CreateAlbumFormData) => album.createMyAlbum(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  const updateAlbumMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAlbumFormData }) =>
      album.updateMyAlbum(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['album', id] });
    },
  });

  const deleteAlbumMutation = useMutation({
    mutationFn: (id: string) => album.deleteMyAlbum(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
  });

  return {
    getAlbumList,
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
  };
};
