import apiClient from './apiClient'; // Đường dẫn tới tệp apiClient

export const getAllMedias = async () => {
  try {
    const res = await apiClient.get('/api/medias');
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createMedia = async (request: any) => {
  try {
    const res = await apiClient.post('/api/medias', request, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getDetailMedia = async (id: any) => {
  try {
    const res = await apiClient.get(`/api/medias/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
