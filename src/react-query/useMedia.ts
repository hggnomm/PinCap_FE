import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import * as media from "@/api/media";
import { CreateMediaFormData, UpdateMediaFormData } from "@/validation";

export const useMedia = () => {
  const queryClient = useQueryClient();

  const getMediaList = (page = 1) => {
    return useQuery({
      queryKey: ["medias", "all", page],
      queryFn: () => media.getAllMedias({ page }),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const getMediaById = (id: string, tag_flg?: boolean) => {
    return useQuery({
      queryKey: ["media", id],
      queryFn: () => media.getDetailMedia(id, tag_flg),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    });
  };

  const getMyMedia = (page = 1, isCreated = true, enabled = true) => {
    return useQuery({
      queryKey: ["medias", "my-media", isCreated ? "created" : "saved", page],
      queryFn: () =>
        media.getMyMedias({ pageParam: page, is_created: isCreated }),
      enabled: enabled,
      staleTime: 5 * 60 * 1000,
    });
  };

  const createMediaMutation = useMutation({
    mutationFn: (data: CreateMediaFormData) => media.createMedia(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
      queryClient.invalidateQueries({ queryKey: ["medias", "all"] });
      queryClient.invalidateQueries({ queryKey: ["medias", "my-media"] });

      if (data.is_created === false) {
        queryClient.invalidateQueries({
          queryKey: ["medias", "my-media", "saved"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["medias", "my-media", "created"],
        });
      }
    },
  });

  const updateMediaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMediaFormData }) =>
      media.updatedMedia(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
      queryClient.invalidateQueries({ queryKey: ["medias", "all"] });
      queryClient.invalidateQueries({ queryKey: ["medias", "my-media"] });
      queryClient.invalidateQueries({ queryKey: ["media", id] });
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: (ids: string[]) => media.deleteMedias(ids),
    onSuccess: () => {
      // Invalidate all media-related queries
      queryClient.invalidateQueries({ queryKey: ["medias"] });
      queryClient.invalidateQueries({ queryKey: ["medias", "all"] });
      queryClient.invalidateQueries({ queryKey: ["medias", "my-media"] });
    },
  });

  const mediaReactionMutation = useMutation({
    mutationFn: (data: { mediaId: string; feelingId: string }) =>
      media.mediaReactions(data),
    onSuccess: (_, { mediaId }) => {
      queryClient.invalidateQueries({ queryKey: ["media", mediaId] });
    },
  });

  return {
    getMediaList,
    getMediaById,
    getMyMedia,
    createMedia: createMediaMutation.mutateAsync,
    createMediaLoading: createMediaMutation.isPending,
    createMediaError: createMediaMutation.error,
    updateMedia: updateMediaMutation.mutateAsync,
    updateMediaLoading: updateMediaMutation.isPending,
    updateMediaError: updateMediaMutation.error,
    deleteMedia: deleteMediaMutation.mutateAsync,
    deleteMediaLoading: deleteMediaMutation.isPending,
    deleteMediaError: deleteMediaMutation.error,
    mediaReaction: mediaReactionMutation.mutateAsync,
    mediaReactionLoading: mediaReactionMutation.isPending,
    mediaReactionError: mediaReactionMutation.error,
  };
};
