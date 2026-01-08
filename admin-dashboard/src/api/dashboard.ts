import apiClient from "./apiClient";

// ==================== Types ====================

export interface DashboardStats {
  total_users: number;
  total_media: number;
  total_albums: number;
  total_media_policy_violation: number;
}

export interface DashboardStatsResponse {
  data: DashboardStats;
}

// ==================== API Functions ====================

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response = await apiClient.get("/api/admin/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Failed to get dashboard stats:", error);
    throw error;
  }
};
