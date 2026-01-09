import type { SafeSearchData } from "@/types/vision";

export interface ImagePolicyCheckResult {
  status: "SAFE" | "WARNING" | "VIOLATION";
  message: string;
}

/**
 * Checks image policy based on safe_search_data
 * Only checks: adult, violence, racy
 * Ignores: spoof, medical
 *
 * @param safeSearchData - Array of safe search data from API response
 * @returns Policy check result with status and message
 */
export const checkImagePolicy = (
  safeSearchData: SafeSearchData[]
): ImagePolicyCheckResult => {
  if (!safeSearchData || safeSearchData.length === 0) {
    return { status: "SAFE", message: "Success image policy" };
  }

  const { adult, violence, racy } = safeSearchData[0];
  const targetValues = [adult, violence, racy];

  // Case 3: Violation - Any field is LIKELY or VERY_LIKELY
  if (targetValues.some((val) => ["LIKELY", "VERY_LIKELY"].includes(val || ""))) {
    return { status: "VIOLATION", message: "Image has policy violation" };
  }

  // Case 2: Warning - Any field is POSSIBLE (and none are Likely/Very Likely)
  if (targetValues.some((val) => val === "POSSIBLE")) {
    return {
      status: "WARNING",
      message: "This image may contain sensitive or disturbing content",
    };
  }

  // Case 1: Safe - All fields are UNLIKELY, VERY_UNLIKELY, or UNKNOWN
  return { status: "SAFE", message: "Success image policy" };
};

