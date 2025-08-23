import axios from "axios";
import apiClient from "./apiClient";
const baseUrl = import.meta.env.VITE_BASE_API as string;

export const login = async (data: any) => {
  var config = {
    method: "post",
    url: `${baseUrl}/api/auth/login`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const register = async (data: any) => {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
    url: `${baseUrl}/api/auth/register`,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || "An error occurred",
      };
    } else if (error.request) {
      return {
        status: 500,
        message: "Network Error: No response from server",
      };
    } else {
      return {
        status: 500,
        message: error.message || "An unknown error occurred",
      };
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/api/users/my-profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};
