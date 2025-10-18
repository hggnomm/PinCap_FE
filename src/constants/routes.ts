export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  NOT_FOUND: "/404",
  FORBIDDEN: "/403",

  // Protected routes
  PINCAP_HOME: "/home",
  CREATE_MEDIA: "/create-media",
  AI_TOOLS: "/ai",
  MEDIA_DETAIL: "/media/:id",
  MY_ALBUM: "/album",
  ALBUM_DETAIL: "/album/:id",
  MY_MEDIA: "/my-media",
  PROFILE: "/profile",
  EDIT_PROFILE: "/profile/edit",
  USER_PROFILE: "/profiles/:id",
  SEARCH: "/search",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.NOT_FOUND,
  ROUTES.FORBIDDEN,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.PINCAP_HOME,
  ROUTES.CREATE_MEDIA,
  ROUTES.AI_TOOLS,
  ROUTES.MEDIA_DETAIL,
  ROUTES.MY_ALBUM,
  ROUTES.ALBUM_DETAIL,
  ROUTES.MY_MEDIA,
  ROUTES.PROFILE,
  ROUTES.EDIT_PROFILE,
  ROUTES.USER_PROFILE,
  ROUTES.SEARCH,
] as const;

export type RouteType = (typeof ROUTES)[keyof typeof ROUTES];
