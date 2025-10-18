import { notification } from "antd";

export interface ApiError {
  status?: number;
  message: string;
  errors?: string[];
}

export const showApiError = (error: ApiError) => {
  const { status, message, errors } = error;

  if (status === 404) {
    return;
  }

  // Determine notification type and title based on status
  let notificationType: "error" | "warning" | "info" = "error";
  let title = "Error";

  if (status) {
    switch (status) {
      case 401:
        notificationType = "warning";
        title = "Authentication Failed";
        break;
      case 403:
        notificationType = "error";
        title = "Access Denied";
        break;
      case 422:
        notificationType = "warning";
        title = "Validation Error";
        break;
      case 423:
        notificationType = "error";
        title = "Account Locked";
        break;
      case 500:
        notificationType = "error";
        title = "Server Error";
        break;
      default:
        notificationType = "error";
        title = "Error";
    }
  }

  let description = message;

  // Add additional errors if present
  if (errors && errors.length > 0) {
    const errorDetails = errors.map((err) => `• ${err}`).join("\n");
    description += `\n\nDetails:\n${errorDetails}`;
  }

  notification[notificationType]({
    message: title,
    description,
    duration: 5,
    style: {
      whiteSpace: "pre-line",
    },
  });
};
