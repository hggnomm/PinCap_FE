/**
 * Google Vision API Types
 * TypeScript definitions for Google Vision API requests and responses
 */

export type SafeSearchLikelihood =
  | "UNKNOWN"
  | "VERY_UNLIKELY"
  | "UNLIKELY"
  | "POSSIBLE"
  | "LIKELY"
  | "VERY_LIKELY";

/**
 * Safe search data structure from API response
 * Only checks: adult, violence, racy
 * Ignores: spoof, medical
 */
export interface SafeSearchData {
  adult?: string;
  spoof?: string;
  medical?: string;
  violence?: string;
  racy?: string;
}

export interface ImagePolicyCheckResult {
  status: "SAFE" | "WARNING" | "VIOLATION";
  message: string;
}
