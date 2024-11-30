import apiClient from "./apiClient";

export const relationships = async (request: any) => {
  try {
    const res = await apiClient.post(`/api/users/relationships`, request);
    return res;
  } catch (error) {
    console.log(error);
  }
};
