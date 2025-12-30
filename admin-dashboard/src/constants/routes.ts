export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  NOT_FOUND: "/404",
  FORBIDDEN: "/403",

  // Admin routes
  DASHBOARD: "/dashboard",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.NOT_FOUND,
  ROUTES.FORBIDDEN,
] as const;

export type RouteType = (typeof ROUTES)[keyof typeof ROUTES];

