// Search constants
export const SEARCH_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 50,
  MIN_SEARCH_LENGTH: 1,
} as const;

// Empty pagination response
export const EMPTY_PAGINATION_RESPONSE = {
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: SEARCH_CONSTANTS.DEFAULT_PER_PAGE,
  total: 0,
};

// Search query parameter keys
export const SEARCH_PARAMS = {
  SEARCH: "search",
  PAGE: "page",
  PER_PAGE: "per_page",
} as const;
