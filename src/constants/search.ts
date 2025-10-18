// Search constants
export const SEARCH_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 15,
  MAX_PER_PAGE: 50,
  MIN_SEARCH_LENGTH: 1,
} as const;

// Search query parameter keys
export const SEARCH_PARAMS = {
  SEARCH: "search",
  PAGE: "page",
  PER_PAGE: "per_page",
} as const;
