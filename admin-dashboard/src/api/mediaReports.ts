import apiClient from "./apiClient";
import type { MessageResponse, ReportReason, UserInfo } from "./types";

// ==================== Types ====================

export interface MediaInfo {
  id: string;
  media_name: string;
  media_url: string;
}

export interface AdminMediaReport {
  id: string;
  report_state: string;
  user_id: string;
  media_id: string;
  reason_report_id?: string | null;
  other_reasons?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  user_report?: UserInfo | null;
  report_media?: MediaInfo | null;
  reason_report?: ReportReason | null;
}

export interface GetMediaReportsParams {
  report_state?: "0" | "1" | "2";
  user_id?: string;
  media_id?: string;
  deleted_at?: "null" | "not_null";
  per_page?: number;
  page?: number;
  order_key?: string;
  order_type?: "asc" | "desc";
}

export interface UpdateMediaReportData {
  report_state?: "0" | "1" | "2";
  reason_report_id?: string | null;
  other_reasons?: string | null;
}

export interface GetMediaReportsResponse {
  data: AdminMediaReport[];
}

export interface MediaReportResponse {
  data: AdminMediaReport;
}

// ==================== API Functions ====================

/**
 * Get list of media reports with filter and pagination
 */
export const getMediaReports = async (
  params?: GetMediaReportsParams
): Promise<GetMediaReportsResponse> => {
  try {
    const response = await apiClient.get("/api/admin/media-reports", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get media reports:", error);
    throw error;
  }
};

/**
 * Update media report state or reason
 */
export const updateMediaReport = async (
  reportId: string,
  data: UpdateMediaReportData
): Promise<MediaReportResponse> => {
  try {
    const response = await apiClient.put(
      `/api/admin/media-reports/${reportId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update media report:", error);
    throw error;
  }
};

/**
 * Soft delete a media report
 */
export const deleteMediaReport = async (
  reportId: string
): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(
      `/api/admin/media-reports/${reportId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete media report:", error);
    throw error;
  }
};

/**
 * Restore a soft-deleted media report
 */
export const restoreMediaReport = async (
  reportId: string
): Promise<MediaReportResponse> => {
  try {
    const response = await apiClient.post(
      `/api/admin/media-reports/${reportId}/restore`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to restore media report:", error);
    throw error;
  }
};

/**
 * Permanently delete a media report from database
 */
export const forceDeleteMediaReport = async (
  reportId: string
): Promise<MessageResponse> => {
  try {
    const response = await apiClient.delete(
      `/api/admin/media-reports/${reportId}/force`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to force delete media report:", error);
    throw error;
  }
};
