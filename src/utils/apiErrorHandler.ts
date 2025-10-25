import { showApiError } from './errorHandler';

/**
 * Helper function to show API error toast when explicitly needed
 * @param error - The error object from API response
 * @param customMessage - Optional custom message to override default
 */
export const showErrorToast = (error: any, customMessage?: string) => {
  const errorData = {
    status: error?.status || error?.response?.status || 500,
    message: customMessage || error?.message || error?.response?.data?.message || "An error occurred",
    errors: error?.errors || error?.response?.data?.errors || []
  };
  
  showApiError(errorData);
};

/**
 * Helper function to make API calls with error notification enabled
 * @param apiCall - The API call function
 * @param showError - Whether to show error toast (default: false)
 */
export const withErrorNotification = (apiCall: any, showError: boolean = false) => {
  return async (...args: any[]) => {
    try {
      return await apiCall(...args);
    } catch (error) {
      if (showError) {
        showErrorToast(error);
      }
      throw error;
    }
  };
};
