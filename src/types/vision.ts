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

export interface SafeSearchAnnotation {
  adult: SafeSearchLikelihood;
  spoof: SafeSearchLikelihood;
  medical: SafeSearchLikelihood;
  violence: SafeSearchLikelihood;
  racy: SafeSearchLikelihood;
}

export interface VisionFeature {
  type: string;
  maxResults?: number;
}

export interface VisionImage {
  content: string;
  source?: {
    imageUri: string;
  };
}

export interface VisionRequest {
  image: VisionImage;
  features: VisionFeature[];
}

export interface VisionError {
  code: number;
  message: string;
}

export interface VisionResponse {
  safeSearchAnnotation?: SafeSearchAnnotation;
  error?: VisionError;
}

export interface VisionApiRequest {
  requests: VisionRequest[];
}

export interface VisionApiResponse {
  responses: VisionResponse[];
}

export interface VisionApiError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

/**
 * Safe search data structure from API response
 * Only checks: adult, violence, racy
 * Ignores: spoof, medical
 */
export interface SafeSearchData {
  adult: SafeSearchLikelihood;
  spoof?: SafeSearchLikelihood;
  medical?: SafeSearchLikelihood;
  violence: SafeSearchLikelihood;
  racy: SafeSearchLikelihood;
}

export interface ImagePolicyCheckResult {
  status: "SAFE" | "WARNING" | "VIOLATION";
  message: string;
}
