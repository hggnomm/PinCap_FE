import apiClient from "./apiClient";

export const AddRelationships = async (request: any) => {
  try {
    const res = await apiClient.post(`/api/users/relationships`, request);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const DeleteRelationships = async (request: any) => {
  try {
    const res = await apiClient.delete(`/api/users/relationships`, request);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
