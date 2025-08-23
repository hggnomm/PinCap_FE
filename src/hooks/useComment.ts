import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as comments from '../api/comments';

export const useComment = () => {
  const queryClient = useQueryClient();

  const getComments = (mediaId: string, page = 1) => {
    return useQuery({
      queryKey: ['comments', mediaId, page],
      queryFn: () => comments.getComments(mediaId, page),
      enabled: !!mediaId,
      staleTime: 5 * 60 * 1000,
    });
  };

  const getReplies = (commentId: string, page = 1) => {
    return useQuery({
      queryKey: ['replies', commentId, page],
      queryFn: () => comments.getReplies(commentId, page),
      enabled: !!commentId,
      staleTime: 5 * 60 * 1000,
    });
  };

  const createComment = useMutation({
    mutationFn: (data: { media_id: string; content: string; image?: File }) =>
      comments.createComment(data),
    onSuccess: (_, { media_id }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', media_id] });
      queryClient.invalidateQueries({ queryKey: ['media', media_id] });
    },
  });

  const replyComment = useMutation({
    mutationFn: (data: { comment_id: string; content: string; image?: File }) =>
      comments.replyComment(data),
    onSuccess: (_, { comment_id }) => {
      queryClient.invalidateQueries({ queryKey: ['replies', comment_id] });
    },
  });

  const toggleCommentReaction = useMutation({
    mutationFn: (data: { commentId: string; feelingId: string }) =>
      comments.toggleCommentReaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
    },
  });

  const toggleReplyReaction = useMutation({
    mutationFn: (data: { replyId: string; feelingId: string }) =>
      comments.toggleReplyReaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies'] });
    },
  });

  return {
    getComments,
    getReplies,
    createComment: createComment.mutate,
    createCommentLoading: createComment.isPending,
    createCommentError: createComment.error,
    replyComment: replyComment.mutate,
    replyCommentLoading: replyComment.isPending,
    replyCommentError: replyComment.error,
    toggleCommentReaction: toggleCommentReaction.mutate,
    toggleCommentReactionLoading: toggleCommentReaction.isPending,
    toggleReplyReaction: toggleReplyReaction.mutate,
    toggleReplyReactionLoading: toggleReplyReaction.isPending,
  };
};
