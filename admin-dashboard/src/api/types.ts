// ==================== Shared Types ====================

export interface MessageResponse {
  message: string;
}

export interface ReportReason {
  id: string;
  title: string;
  description: string;
}

export interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

