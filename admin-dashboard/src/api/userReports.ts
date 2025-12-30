import apiClient from "./apiClient";
import type { MessageResponse, ReportReason, UserInfo } from "./types";

// ==================== Types ====================

export interface AdminUserReport {
  id: string;
  report_state: string;
  user_id: string;
  user_report_id: string;
  reason_report_id?: string | null;
  other_reasons?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  user?: UserInfo | null;
  reporter?: UserInfo | null;
  reason_report?: ReportReason | null;
}

export interface GetUserReportsParams {
  report_state?: "0" | "1" | "2";
  user_id?: string;
  user_report_id?: string;
  deleted_at?: "null" | "not_null";
  per_page?: number;
  page?: number;
  order_key?: string;
  order_type?: "asc" | "desc";
}

export interface UpdateUserReportData {
  report_state?: "0" | "1" | "2";
  reason_report_id?: string | null;
  other_reasons?: string | null;
}

export interface GetUserReportsResponse {
  data: AdminUserReport[];
}

export interface UserReportResponse {
  data: AdminUserReport;
}

// ==================== API Functions ====================

/**
 * Get list of user reports with filter and pagination
 */
export const getUserReports = async (
  params?: GetUserReportsParams
): Promise<GetUserReportsResponse> => {
  try {
    const response = await apiClient.get("/api/admin/user-reports", { params });
    return response.data;
  } catch (error) {
    console.error("Failed to get user reports:", error);
    throw error;
  }
};

/**
 * Update user report state or reason
 */
export const updateUserReport = async (
  reportId: string,
  data: UpdateUserReportData
): Promise<UserReportResponse> => {
  try {
    const response = await apiClient.put(
      `/api/admin/user-reports/${reportId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update user report:", error);
    throw error;
  }
};

/**
 * Soft delete a user report
 */
export const deleteUserReport = async (
  reportId: string
): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(
      `/api/admin/user-reports/${reportId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete user report:", error);
    throw error;
  }
};

/**
 * Restore a soft-deleted user report
 */
export const restoreUserReport = async (
  reportId: string
): Promise<UserReportResponse> => {
  try {
    const response = await apiClient.post(
      `/api/admin/user-reports/${reportId}/restore`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to restore user report:", error);
    throw error;
  }
};

/**
 * Permanently delete a user report from database
 */
export const forceDeleteUserReport = async (
  reportId: string
): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(
      `/api/admin/user-reports/${reportId}/force`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to force delete user report:", error);
    throw error;
  }
};
