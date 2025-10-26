import axios from "axios";

import { ENV } from "@/constants/env";
import { ROUTES } from "@/constants/routes";
import { showApiError } from "@/utils/errorHandler";

const baseUrl = ENV.BASE_API;

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
    let errorData = {
      status: 500,
      message: "An unknown error occurred",
      errors: [],
    };

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data.message || "An error occurred";
      const errors = error.response.data.errors || [];

      errorData = {
        status: status,
        message: message,
        errors: errors,
      };

      if (status === 401) {
        localStorage.removeItem("token");
        const currentPath = window.location.pathname;
        if (
          !currentPath.includes(ROUTES.LOGIN) &&
          !currentPath.includes(ROUTES.REGISTER)
        ) {
          window.location.href = ROUTES.LOGIN;
        }

        return Promise.reject(errorData);
      }
    } else if (error.request) {
      errorData = {
        status: 500,
        message: "Network Error: No response from server",
        errors: [],
      };
    } else {
      errorData = {
        status: 500,
        message: error.message || "An unknown error occurred",
        errors: [],
      };
    }

    if (error.config?.showErrorNotification) {
      showApiError(errorData);
    }

    return Promise.reject(errorData);
  }
);

export default apiClient;
