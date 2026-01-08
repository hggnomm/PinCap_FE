import apiClient from "./apiClient";
import type { MessageResponse } from "./types";

// ==================== Types ====================
export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  role: string;
  avatar?: string | null;
  background?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface GetUsersParams {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: "0" | "1";
  deleted_at?: "null" | "not_null";
  per_page?: number;
  page?: number;
  order_key?: string;
  order_type?: "asc" | "desc";
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string | null;
  role?: "0" | "1" | null;
  avatar?: string | null;
  background?: string | null;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone?: string | null;
  role?: "0" | "1" | null;
  avatar?: string | null;
  background?: string | null;
}

export interface GetUsersResponse {
  data: AdminUser[];
  total?: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
}

export interface UserResponse {
  data: AdminUser;
}

// ==================== API Functions ====================

/**
 * Get list of users with search, filter and pagination
 */
export const getUsers = async (
  params?: GetUsersParams
): Promise<GetUsersResponse> => {
  try {
    const response = await apiClient.get("/api/admin/users", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to get users:", error);
    throw error;
  }
};

/**
 * Create a new user
 */
export const createUser = async (
  data: CreateUserData
): Promise<UserResponse> => {
  try {
    const response = await apiClient.post("/api/admin/users", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};

/**
 * Update user information
 */
export const updateUser = async (
  userId: string,
  data: UpdateUserData
): Promise<UserResponse> => {
  try {
    const response = await apiClient.put(`/api/admin/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

/**
 * Soft delete a user
 */
export const deleteUser = async (userId: string): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

/**
 * Restore a soft-deleted user
 */
export const restoreUser = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await apiClient.post(
      `/api/admin/users/${userId}/restore`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to restore user:", error);
    throw error;
  }
};

/**
 * Permanently delete a user from database
 */
export const forceDeleteUser = async (
  userId: string
): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(
      `/api/admin/users/${userId}/force`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to force delete user:", error);
    throw error;
  }
};

