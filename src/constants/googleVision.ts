/**
 * Google Vision SafeSearch Detection Constants
 */

export const SAFE_SEARCH_TYPES = {
  ADULT: "adult",
  SPOOF: "spoof",
  MEDICAL: "medical",
  VIOLENCE: "violence",
  RACY: "racy",
} as const;

export const SAFE_SEARCH_LIKELIHOOD = {
  UNKNOWN: "UNKNOWN",
  VERY_UNLIKELY: "VERY_UNLIKELY",
  UNLIKELY: "UNLIKELY",
  POSSIBLE: "POSSIBLE",
  LIKELY: "LIKELY",
  VERY_LIKELY: "VERY_LIKELY",
} as const;

export const SAFE_SEARCH_TYPE_DESCRIPTIONS = {
  [SAFE_SEARCH_TYPES.ADULT]: "Ảnh có nội dung khiêu dâm, khỏa thân, gợi dục",
  [SAFE_SEARCH_TYPES.SPOOF]: "Ảnh giả mạo, meme, nội dung chế",
  [SAFE_SEARCH_TYPES.MEDICAL]: "Ảnh liên quan đến y học, cơ thể, thương tích",
  [SAFE_SEARCH_TYPES.VIOLENCE]: "Ảnh có yếu tố bạo lực, máu me, đánh nhau",
  [SAFE_SEARCH_TYPES.RACY]:
    "Ảnh có yếu tố gợi cảm, gợi dục nhẹ (pose, quần áo, tư thế, v.v.)",
} as const;

export const SAFE_SEARCH_LIKELIHOOD_DESCRIPTIONS = {
  [SAFE_SEARCH_LIKELIHOOD.UNKNOWN]:
    "Không xác định được (thường do ảnh quá mờ, nhỏ, hoặc không đủ dữ liệu)",
  [SAFE_SEARCH_LIKELIHOOD.VERY_UNLIKELY]:
    "Rất không có khả năng có nội dung đó",
  [SAFE_SEARCH_LIKELIHOOD.UNLIKELY]: "Không có khả năng",
  [SAFE_SEARCH_LIKELIHOOD.POSSIBLE]: "Có thể có",
  [SAFE_SEARCH_LIKELIHOOD.LIKELY]: "Có khả năng cao",
  [SAFE_SEARCH_LIKELIHOOD.VERY_LIKELY]: "Gần như chắc chắn",
} as const;

export const SAFE_SEARCH_DANGER_LEVELS = {
  [SAFE_SEARCH_LIKELIHOOD.UNKNOWN]: 0, // ⚪ Neutral
  [SAFE_SEARCH_LIKELIHOOD.VERY_UNLIKELY]: 1, // 🟢 Safe
  [SAFE_SEARCH_LIKELIHOOD.UNLIKELY]: 1, // 🟢 Safe
  [SAFE_SEARCH_LIKELIHOOD.POSSIBLE]: 3, // 🟠 Needs further review / mild warning
  [SAFE_SEARCH_LIKELIHOOD.LIKELY]: 4, // 🔴 Likely violation
  [SAFE_SEARCH_LIKELIHOOD.VERY_LIKELY]: 5, // 🔴 Clear violation
} as const;

export const SAFE_SEARCH_DANGER_EMOJIS = {
  [SAFE_SEARCH_LIKELIHOOD.UNKNOWN]: "⚪",
  [SAFE_SEARCH_LIKELIHOOD.VERY_UNLIKELY]: "🟢",
  [SAFE_SEARCH_LIKELIHOOD.UNLIKELY]: "🟢",
  [SAFE_SEARCH_LIKELIHOOD.POSSIBLE]: "🟠",
  [SAFE_SEARCH_LIKELIHOOD.LIKELY]: "🔴",
  [SAFE_SEARCH_LIKELIHOOD.VERY_LIKELY]: "🔴",
} as const;

export const SAFE_SEARCH_DANGER_COLORS = {
  [SAFE_SEARCH_LIKELIHOOD.UNKNOWN]: "#6B7280", // Gray
  [SAFE_SEARCH_LIKELIHOOD.VERY_UNLIKELY]: "#10B981", // Green
  [SAFE_SEARCH_LIKELIHOOD.UNLIKELY]: "#10B981", // Green
  [SAFE_SEARCH_LIKELIHOOD.POSSIBLE]: "#F59E0B", // Orange
  [SAFE_SEARCH_LIKELIHOOD.LIKELY]: "#EF4444", // Red
  [SAFE_SEARCH_LIKELIHOOD.VERY_LIKELY]: "#DC2626", // Dark Red
} as const;

export type SafeSearchType =
  (typeof SAFE_SEARCH_TYPES)[keyof typeof SAFE_SEARCH_TYPES];
export type SafeSearchLikelihood =
  (typeof SAFE_SEARCH_LIKELIHOOD)[keyof typeof SAFE_SEARCH_LIKELIHOOD];

export interface SafeSearchResult {
  adult: SafeSearchLikelihood;
  spoof: SafeSearchLikelihood;
  medical: SafeSearchLikelihood;
  violence: SafeSearchLikelihood;
  racy: SafeSearchLikelihood;
}
