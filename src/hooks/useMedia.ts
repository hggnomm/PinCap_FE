import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as media from '@/api/media';
import { CreateMediaFormData, UpdateMediaFormData } from '@/validation';

export const useMedia = () => {
  const queryClient = useQueryClient();

  const getMediaList = (page = 1) => {
    return useQuery({
      queryKey: ['media', page],
      queryFn: () => media.getAllMedias({ pageParam: page }),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const getMediaById = (id: string) => {
    return useQuery({
      queryKey: ['media', id],
      queryFn: () => media.getDetailMedia(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  const getMyMedia = (page = 1, isCreated = true) => {
    return useQuery({
      queryKey: ['my-media', page, isCreated],
      queryFn: () => media.getMyMedias({ pageParam: page, is_created: isCreated }),
      staleTime: 5 * 60 * 1000,
    });
  };

  const createMediaMutation = useMutation({
    mutationFn: (data: CreateMediaFormData) => media.createMedia(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['my-media'] });
    },
  });

  const updateMediaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMediaFormData }) =>
      media.updatedMedia(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media', id] });
      queryClient.invalidateQueries({ queryKey: ['my-media'] });
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: (ids: string[]) => media.deleteMedias(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['my-media'] });
    },
  });

  return {
    getMediaList,
    getMediaById,
    getMyMedia,
    createMedia: createMediaMutation.mutate,
    createMediaLoading: createMediaMutation.isPending,
    createMediaError: createMediaMutation.error,
    updateMedia: updateMediaMutation.mutate,
    updateMediaLoading: updateMediaMutation.isPending,
    updateMediaError: updateMediaMutation.error,
    deleteMedia: deleteMediaMutation.mutate,
    deleteMediaLoading: deleteMediaMutation.isPending,
    deleteMediaError: deleteMediaMutation.error,
  };
};
