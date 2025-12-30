import apiClient from "./apiClient";
import type { MessageResponse } from "./types";

// ==================== Types ====================
export interface AdminReportReason {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface GetReportReasonsParams {
  title?: string;
  deleted_at?: "null" | "not_null";
  per_page?: number;
  page?: number;
  order_key?: string;
  order_type?: "asc" | "desc";
}

export interface CreateReportReasonData {
  title: string;
  description: string;
}

export interface UpdateReportReasonData {
  title?: string;
  description?: string;
}

export interface GetReportReasonsResponse {
  data: AdminReportReason[];
}

export interface ReportReasonResponse {
  data: AdminReportReason;
}

// ==================== API Functions ====================

/**
 * Get list of report reasons with search and pagination
 */
export const getReportReasons = async (
  params?: GetReportReasonsParams
): Promise<GetReportReasonsResponse> => {
  try {
    const response = await apiClient.get("/api/admin/report-reasons", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get report reasons:", error);
    throw error;
  }
};

/**
 * Create a new report reason
 */
export const createReportReason = async (
  data: CreateReportReasonData
): Promise<ReportReasonResponse> => {
  try {
    const response = await apiClient.post("/api/admin/report-reasons", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create report reason:", error);
    throw error;
  }
};

/**
 * Update report reason information
 */
export const updateReportReason = async (
  reasonId: string,
  data: UpdateReportReasonData
): Promise<ReportReasonResponse> => {
  try {
    const response = await apiClient.put(
      `/api/admin/report-reasons/${reasonId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update report reason:", error);
    throw error;
  }
};

/**
 * Soft delete a report reason (only if not in use)
 */
export const deleteReportReason = async (
  reasonId: string
): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(
      `/api/admin/report-reasons/${reasonId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete report reason:", error);
    throw error;
  }
};

/**
 * Restore a soft-deleted report reason
 */
export const restoreReportReason = async (
  reasonId: string
): Promise<ReportReasonResponse> => {
  try {
    const response = await apiClient.post(
      `/api/admin/report-reasons/${reasonId}/restore`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to restore report reason:", error);
    throw error;
  }
};

/**
 * Permanently delete a report reason from database
 */
export const forceDeleteReportReason = async (
  reasonId: string
): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(
      `/api/admin/report-reasons/${reasonId}/force`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to force delete report reason:", error);
    throw error;
  }
};

