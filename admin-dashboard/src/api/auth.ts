import apiClient from "./apiClient";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export const login = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await apiClient.post("/api/auth/login", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get("/api/users/my-profile");
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post("/api/auth/logout");
  return response.data;
};

