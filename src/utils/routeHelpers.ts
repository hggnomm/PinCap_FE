import { NavigateFunction } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

/**
 * Redirect to 404 Not Found page
 */
export const redirectToNotFound = (navigate: NavigateFunction) => {
  navigate(ROUTES.NOT_FOUND, { replace: true });
};

/**
 * Redirect to 403 Forbidden page
 */
export const redirectToForbidden = (navigate: NavigateFunction) => {
  navigate(ROUTES.FORBIDDEN, { replace: true });
};

/**
 * Redirect to Home page
 */
export const redirectToHome = (navigate: NavigateFunction) => {
  navigate(ROUTES.HOME, { replace: true });
};

/**
 * Check if user has permission (example helper)
 * You can customize this based on your permission system
 */
export const checkPermission = (userRole: string, requiredRole: string): boolean => {
  // Example: implement your permission logic here
  return userRole === requiredRole;
};

