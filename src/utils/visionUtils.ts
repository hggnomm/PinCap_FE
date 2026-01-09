import { SafeSearchData, ImagePolicyCheckResult } from "@/types/vision";

/**
 * Checks image policy based on safe_search_data
 * Only checks: adult, violence
 * Ignores: spoof, medical, racy
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

  const { adult, violence } = safeSearchData[0];
  const targetValues = [adult, violence];

  // Case 3: Violation - Any field is LIKELY or VERY_LIKELY
  if (targetValues.some((val) => ["LIKELY", "VERY_LIKELY"].includes(val))) {
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
