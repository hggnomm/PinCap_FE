import axios from "axios";

import { ENV } from "@/constants/env";
import type { User } from "@/types/type";
import { LoginFormData, RegisterFormData } from "@/validation/auth";

import apiClient from "./apiClient";

const baseUrl = ENV.BASE_API;

export const login = async (data: LoginFormData) => {
  const config = {
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

export const register = async (data: RegisterFormData) => {
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

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiClient.get("/api/users/my-profile");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch current user", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Failed to logout", error);
    throw error;
  }
};

// Verify email with token
export const verifyEmail = async (token: string) => {
  try {
    const response = await apiClient.get(`/api/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    console.error("Failed to verify email", error);
    throw error;
  }
};

// Resend verification email
export const resendVerifyEmail = async (email: string) => {
  try {
    const response = await apiClient.post("/api/auth/resend-verify-email", {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to resend verification email", error);
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (email: string) => {
  try {
    const response = await apiClient.post("/api/auth/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to request password reset", error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (data: {
  token: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/api/auth/reset-password", data);
    return response.data;
  } catch (error) {
    console.error("Failed to reset password", error);
    throw error;
  }
};

// Get Google OAuth URL
export const getGoogleOAuthUrl = async () => {
  try {
    const response = await apiClient.get("/api/auth/google/url");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Google OAuth URL", error);
    throw error;
  }
};

// Health check endpoint
export const healthCheck = async () => {
  try {
    const response = await apiClient.get("/api/health-check");
    return response.data;
  } catch (error) {
    console.error("Health check failed", error);
    throw error;
  }
};
