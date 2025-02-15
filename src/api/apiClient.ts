import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_API;

const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || "An error occurred";
      console.log(`Error ${status}: ${message}`);

      // if (status === 401) {
      // }

      return Promise.reject({
        status: status,
        message: message,
      });
    } else if (error.request) {
      console.log("Network Error: No response from server");
      return Promise.reject({
        status: 500,
        message: "Network Error: No response from server",
      });
    } else {
      console.log(`Error: ${error.message}`);
      return Promise.reject({
        status: 500,
        message: error.message || "An unknown error occurred",
      });
    }
  }
);

export default apiClient;
