/**
 * Format follower count to a readable string (e.g., 77.8k, 1.2M)
 * @param count - The follower count number
 * @returns Formatted string
 */
export const formatFollowerCount = (count: number | undefined | null): string => {
  if (!count || count === 0) return "0";
  
  if (count < 1000) {
    return count.toString();
  }
  
  if (count < 1000000) {
    const thousands = count / 1000;
    // Round to 1 decimal place if needed
    if (thousands % 1 === 0) {
      return `${thousands}k`;
    }
    return `${thousands.toFixed(1)}k`;
  }
  
  const millions = count / 1000000;
  if (millions % 1 === 0) {
    return `${millions}M`;
  }
  return `${millions.toFixed(1)}M`;
};

