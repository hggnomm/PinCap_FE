/**
 * Facebook Login Permissions & Scopes
 * Documentation: https://developers.facebook.com/docs/permissions/reference
 */

/**
 * Basic permissions - không cần review từ Facebook
 */
export const FACEBOOK_BASIC_PERMISSIONS = ["public_profile", "email"] as const;

/**
 * Instagram permissions - cần review từ Facebook
 * Documentation: https://developers.facebook.com/docs/instagram-api/overview
 */
export const FACEBOOK_INSTAGRAM_PERMISSIONS = [
  "instagram_basic",
  "instagram_manage_comments",
  "instagram_manage_insights",
] as const;

/**
 * Pages permissions - cần review từ Facebook
 * Documentation: https://developers.facebook.com/docs/pages
 */
export const FACEBOOK_PAGES_PERMISSIONS = [
  "pages_read_engagement",
  "pages_manage_metadata",
  "pages_manage_posts",
] as const;

/**
 * Tất cả permissions được sử dụng trong app
 */
export const FACEBOOK_ALL_PERMISSIONS = [
  ...FACEBOOK_BASIC_PERMISSIONS,
  ...FACEBOOK_INSTAGRAM_PERMISSIONS,
  ...FACEBOOK_PAGES_PERMISSIONS,
] as const;

/**
 * Scope string để truyền vào window.FB.login()
 */
export const FACEBOOK_LOGIN_SCOPE = FACEBOOK_ALL_PERMISSIONS.join(",");
