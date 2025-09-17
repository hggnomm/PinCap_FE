import apiClient from './apiClient';

export const getComments = async (mediaId: string, page = 1) => {
  try {
    const response = await apiClient.get(`/api/medias/${mediaId}/comments`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReplies = async (commentId: string, page = 1) => {
  try {
    const response = await apiClient.get(`/api/medias/comments/${commentId}/replies`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createComment = async (data: { media_id: string; content: string; image?: File }) => {
  try {
    const formData = new FormData();
    formData.append('media_id', data.media_id);
    formData.append('content', data.content);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.post('/api/medias/comment', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const replyComment = async (data: { comment_id: string; content: string; image?: File }) => {
  try {
    const formData = new FormData();
    formData.append('comment_id', data.comment_id);
    formData.append('content', data.content);
    if (data.image) {
      formData.append('image', data.image);
    }

    const response = await apiClient.post('/api/medias/comment/reply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleCommentReaction = async (data: { commentId: string; feelingId: string }) => {
  try {
    const response = await apiClient.post('/api/medias/comment/reactions', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const toggleReplyReaction = async (data: { commentId: string; feelingId: string }) => {
  try {
    const response = await apiClient.post('/api/medias/comment/reply/reactions', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
