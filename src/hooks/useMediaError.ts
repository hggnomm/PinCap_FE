import { useState, useEffect, useCallback } from "react";

interface UseMediaErrorOptions {
  mediaId?: string | number;
  resetOnMediaChange?: boolean;
}

interface UseMediaErrorReturn {
  // Error states
  imageError: boolean;
  videoError: boolean;
  flexibleMediaErrors: { [index: number]: boolean };

  // Error handlers
  setImageError: (error: boolean) => void;
  setVideoError: (error: boolean) => void;
  setFlexibleMediaError: (index: number, error: boolean) => void;

  // Convenience methods
  handleImageError: () => void;
  handleVideoError: () => void;
  handleFlexibleImageError: (index: number) => void;
  handleFlexibleVideoError: (index: number) => void;

  // Reset methods
  resetAll: () => void;
  resetImageError: () => void;
  resetVideoError: () => void;
  resetFlexibleMediaError: (index: number) => void;
  resetFlexibleMediaErrors: () => void;

  // Check methods
  hasError: (index?: number) => boolean;
}

/**
 * Custom hook để quản lý error states cho media (image/video)
 * Hỗ trợ cả single media và flexible media (nhiều media)
 *
 * @param options - Configuration options
 * @param options.mediaId - ID của media, khi thay đổi sẽ reset errors
 * @param options.resetOnMediaChange - Có tự động reset khi mediaId thay đổi không (default: true)
 *
 * @example
 * ```tsx
 * // Single media
 * const { imageError, videoError, handleImageError, handleVideoError } = useMediaError({
 *   mediaId: media?.id,
 * });
 *
 * // Flexible media
 * const { flexibleMediaErrors, handleFlexibleImageError } = useMediaError({
 *   mediaId: media?.id,
 * });
 *
 * <img onError={handleImageError} />
 * <video onError={handleVideoError} />
 * ```
 */
export const useMediaError = (
  options: UseMediaErrorOptions = {}
): UseMediaErrorReturn => {
  const { mediaId, resetOnMediaChange = true } = options;

  const [imageError, setImageError] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [flexibleMediaErrors, setFlexibleMediaErrors] = useState<{
    [index: number]: boolean;
  }>({});

  // Reset tất cả errors khi mediaId thay đổi
  useEffect(() => {
    if (resetOnMediaChange) {
      setImageError(false);
      setVideoError(false);
      setFlexibleMediaErrors({});
    }
  }, [mediaId, resetOnMediaChange]);

  // Error handlers
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
  }, []);

  const handleFlexibleImageError = useCallback((index: number) => {
    setFlexibleMediaErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  }, []);

  const handleFlexibleVideoError = useCallback((index: number) => {
    setFlexibleMediaErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  }, []);

  // Set methods
  const setFlexibleMediaError = useCallback((index: number, error: boolean) => {
    setFlexibleMediaErrors((prev) => ({
      ...prev,
      [index]: error,
    }));
  }, []);

  // Reset methods
  const resetAll = useCallback(() => {
    setImageError(false);
    setVideoError(false);
    setFlexibleMediaErrors({});
  }, []);

  const resetImageError = useCallback(() => {
    setImageError(false);
  }, []);

  const resetVideoError = useCallback(() => {
    setVideoError(false);
  }, []);

  const resetFlexibleMediaError = useCallback((index: number) => {
    setFlexibleMediaErrors((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  }, []);

  const resetFlexibleMediaErrors = useCallback(() => {
    setFlexibleMediaErrors({});
  }, []);

  // Check methods
  const hasError = useCallback(
    (index?: number) => {
      if (index !== undefined) {
        return flexibleMediaErrors[index] === true;
      }
      return (
        imageError || videoError || Object.keys(flexibleMediaErrors).length > 0
      );
    },
    [imageError, videoError, flexibleMediaErrors]
  );

  return {
    // States
    imageError,
    videoError,
    flexibleMediaErrors,

    // Setters
    setImageError,
    setVideoError,
    setFlexibleMediaError,

    // Handlers
    handleImageError,
    handleVideoError,
    handleFlexibleImageError,
    handleFlexibleVideoError,

    // Reset methods
    resetAll,
    resetImageError,
    resetVideoError,
    resetFlexibleMediaError,
    resetFlexibleMediaErrors,

    // Check methods
    hasError,
  };
};
