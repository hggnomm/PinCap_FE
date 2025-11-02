import { showApiError } from "./errorHandler";

/**
 * Helper function to show API error toast when explicitly needed
 * @param error - The error object from API response
 * @param customMessage - Optional custom message to override default
 */
export const showErrorToast = (error: any, customMessage?: string) => {
  const errorData = {
    status: error?.status || error?.response?.status || 500,
    message:
      customMessage ||
      error?.message ||
      error?.response?.data?.message ||
      "An error occurred",
    errors: error?.errors || error?.response?.data?.errors || [],
  };

  showApiError(errorData);
};
