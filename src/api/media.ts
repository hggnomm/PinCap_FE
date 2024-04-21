import axios from "axios";

const baseUrl = "http://localhost:8000";

export const getMedia = async (page: any) => {
  const token = localStorage.getItem("token");

  const config = {
    method: "get",
    url: `${baseUrl}/api/media?page=${page}`,
    headers: {
      // 'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios(config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const createMedia = async (request: any) => {
  const token = localStorage.getItem("token");
  const config = {
    method: "post",
    url: `${baseUrl}/api/media`,
    headers: {
      // 'Authorization': `Bearer ${token}`,
      // "Content-Type": "application/json",
      "Content-Type": "multipart/form-data",
    },
    data: request,
  };
  try {
    const res = await axios(config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getDetailMedia = async (id: any) => {
  const token = localStorage.getItem("token");
  const config = {
    method: "get",
    url: `${baseUrl}/api/media/${id}`,
    headers: {
      // 'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios(config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
