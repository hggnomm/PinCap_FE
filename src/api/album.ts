import apiClient from "./apiClient"; // Đường dẫn tới tệp apiClient

export const getAlbumData = async () => {
    try {
      const res = await apiClient.get("/api/albums/my-album", {
        params: {
          per_page: 10,
          page: 1,
        },
      });
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };