import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

import Zoom from "react-medium-image-zoom";

import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";
import "react-medium-image-zoom/dist/styles.css";

import DotsPagination from "@/components/DotsPagination/DotsPagination";
import MediaErrorThumbnail from "@/components/MediaErrorThumbnail";
import { MEDIA_TYPES } from "@/constants/constants";
import { useMediaError } from "@/hooks";
import { Media } from "@/types/type";
import {
  parseMediaUrl,
  ParsedMediaUrl,
  normalizeMediaUrl,
} from "@/utils/utils";
import "./MediaViewer.less";

interface MediaViewerProps {
  media: Media | null;
  className?: string;
  mediaClassName?: string;
  shouldBlockContent?: boolean;
  sensitiveMessage?: string;
  onAcceptSensitiveView?: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({
  media,
  className,
  mediaClassName,
  shouldBlockContent = false,
  sensitiveMessage,
  onAcceptSensitiveView,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [containerMinWidth, setContainerMinWidth] = useState<number>(0);
  const [containerMinHeight, setContainerMinHeight] = useState<number>(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [didInitialShow, setDidInitialShow] = useState<boolean>(false);

  const {
    imageError,
    videoError,
    flexibleMediaErrors,
    handleImageError,
    handleVideoError,
    handleFlexibleImageError,
    handleFlexibleVideoError,
  } = useMediaError({
    mediaId: media?.id,
    resetOnMediaChange: true,
  });

  const isFlexibleMedia = useMemo(() => {
    const isFlexible = media?.type === null;
    return isFlexible;
  }, [media?.type]);

  const flexibleMediaUrls: ParsedMediaUrl[] = useMemo(() => {
    const urls = isFlexibleMedia ? parseMediaUrl(media?.media_url) : [];
    return urls;
  }, [isFlexibleMedia, media?.media_url]);

  const hasMultipleMedia = flexibleMediaUrls.length > 1;
  const isFirstMedia = currentMediaIndex === 0;
  const isLastMedia = currentMediaIndex === flexibleMediaUrls.length - 1;

  const handlePrevMedia = useCallback(() => {
    if (isFirstMedia) return;
    setDirection(-1);
    setIsImageLoaded(false);
    setCurrentMediaIndex((prev) => prev - 1);
  }, [isFirstMedia]);

  const handleNextMedia = useCallback(() => {
    if (isLastMedia) return;
    setDirection(1);
    setIsImageLoaded(false);
    setCurrentMediaIndex((prev) => prev + 1);
  }, [isLastMedia]);

  useEffect(() => {
    setCurrentMediaIndex(0);
    setIsImageLoaded(false);
    setDidInitialShow(false);
  }, [media?.id]);

  const updateContainerSizeFromImage = () => {
    const el = imgRef.current;
    if (el && el.naturalWidth && el.naturalHeight) {
      setContainerMinWidth(el.naturalWidth);
      setContainerMinHeight(el.naturalHeight);
    }
  };

  const updateContainerSizeFromVideo = () => {
    const el = videoRef.current as HTMLVideoElement;
    if (el && el.videoWidth && el.videoHeight) {
      setContainerMinWidth(el.videoWidth);
      setContainerMinHeight(el.videoHeight);
    }
  };

  // Preload images for smooth transitions
  useEffect(() => {
    if (isFlexibleMedia && flexibleMediaUrls.length > 0) {
      const preloadImages = () => {
        flexibleMediaUrls.forEach((mediaUrl) => {
          if (mediaUrl.type === MEDIA_TYPES.IMAGE) {
            const img = new Image();
            img.src = mediaUrl.url;
          }
        });
      };
      preloadImages();
    }
  }, [isFlexibleMedia, flexibleMediaUrls]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && hasMultipleMedia && !isLastMedia) {
      handleNextMedia();
    }
    if (isRightSwipe && hasMultipleMedia && !isFirstMedia) {
      handlePrevMedia();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasMultipleMedia) return;

      if (e.key === "ArrowLeft" && !isFirstMedia) {
        handlePrevMedia();
      } else if (e.key === "ArrowRight" && !isLastMedia) {
        handleNextMedia();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    hasMultipleMedia,
    handlePrevMedia,
    handleNextMedia,
    isFirstMedia,
    isLastMedia,
  ]);

  const renderFlexibleMedia = () => {
    if (!isFlexibleMedia || flexibleMediaUrls.length === 0) return null;

    const currentMedia = flexibleMediaUrls[currentMediaIndex];
    const variants = {
      enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
      },
      exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0,
      }),
    };

    return (
      <div
        className={clsx(
          "media-viewer-container",
          containerMinWidth > 0 &&
            containerMinHeight > 0 &&
            `min-w-[${containerMinWidth}px] min-h-[${containerMinHeight}px]`
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`${media?.id}-${currentMediaIndex}`}
            custom={direction}
            variants={variants}
            initial={didInitialShow ? "enter" : false}
            animate="center"
            exit="exit"
            transition={{
              x: {
                type: "tween",
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
              opacity: { duration: 0.2, ease: "easeInOut" },
            }}
            className="media-content relative rounded-[28px] overflow-hidden"
          >
            {currentMedia.type === MEDIA_TYPES.VIDEO &&
              flexibleMediaErrors[currentMediaIndex] && (
                <MediaErrorThumbnail
                  className={clsx("media-element", mediaClassName)}
                  width={containerMinWidth > 0 ? containerMinWidth : "100%"}
                  height={containerMinHeight > 0 ? containerMinHeight : "auto"}
                  alt="Video error"
                />
              )}
            {currentMedia.type === MEDIA_TYPES.VIDEO &&
              !flexibleMediaErrors[currentMediaIndex] && (
                <video
                  ref={videoRef}
                  src={currentMedia.url}
                  controls
                  autoPlay
                  muted
                  className={clsx("media-element", mediaClassName)}
                  onLoadStart={() => setIsImageLoaded(false)}
                  onLoadedData={() => {
                    setIsImageLoaded(true);
                    updateContainerSizeFromVideo();
                    setDidInitialShow(true);
                  }}
                  onError={() => handleFlexibleVideoError(currentMediaIndex)}
                />
              )}
            {currentMedia.type !== MEDIA_TYPES.VIDEO &&
              flexibleMediaErrors[currentMediaIndex] && (
                <MediaErrorThumbnail
                  className={clsx("media-element", mediaClassName)}
                  width={containerMinWidth > 0 ? containerMinWidth : "100%"}
                  height={containerMinHeight > 0 ? containerMinHeight : "auto"}
                  alt="Image error"
                />
              )}
            {currentMedia.type !== MEDIA_TYPES.VIDEO &&
              !flexibleMediaErrors[currentMediaIndex] && (
                <Zoom>
                  <img
                    ref={imgRef}
                    src={currentMedia.url}
                    alt={media?.media_name}
                    className={clsx(
                      "media-element",
                      mediaClassName,
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => {
                      setIsImageLoaded(true);
                      updateContainerSizeFromImage();
                      setDidInitialShow(true);
                    }}
                    onError={() => handleFlexibleImageError(currentMediaIndex)}
                  />
                </Zoom>
              )}

            <DotsPagination
              total={flexibleMediaUrls.length}
              current={currentMediaIndex}
              onDotClick={setCurrentMediaIndex}
            />
          </motion.div>
        </AnimatePresence>

        {hasMultipleMedia && (
          <>
            <button
              onClick={handlePrevMedia}
              disabled={isFirstMedia}
              className={clsx(
                "absolute top-1/2 -translate-y-1/2 rounded-full !p-2 shadow-lg transition-all z-10 border-none",
                "!bg-white/90 hover:!bg-white active:scale-95",
                "left-4",
                {
                  "!bg-gray-300 cursor-not-allowed opacity-50": isFirstMedia,
                }
              )}
              aria-label="Previous media"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={handleNextMedia}
              disabled={isLastMedia}
              className={clsx(
                "absolute top-1/2 -translate-y-1/2 rounded-full !p-2 shadow-lg transition-all z-10 border-none",
                "!bg-white/90 hover:!bg-white active:scale-95",
                "right-4",
                {
                  "!bg-gray-300 cursor-not-allowed opacity-50": isLastMedia,
                }
              )}
              aria-label="Next media"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    );
  };

  const renderSingleMedia = () => {
    if (!media) return null;

    const normalizedUrls = normalizeMediaUrl(media.media_url);
    const mediaUrl = normalizedUrls[0] || "";

    if (media.type === MEDIA_TYPES.IMAGE) {
      return (
        <div
          className={clsx(
            "media-viewer-container",
            containerMinWidth > 0 &&
              containerMinHeight > 0 &&
              `min-w-[${containerMinWidth}px] min-h-[${containerMinHeight}px]`
          )}
        >
          {imageError && (
            <MediaErrorThumbnail
              className={clsx("media-element", mediaClassName)}
              width={containerMinWidth > 0 ? containerMinWidth : "100%"}
              height={containerMinHeight > 0 ? containerMinHeight : "auto"}
              alt="Image error"
            />
          )}
          {!imageError && (
            <Zoom>
              <img
                ref={imgRef}
                src={mediaUrl}
                alt={media.media_name}
                className={clsx("media-element", mediaClassName)}
                onLoad={updateContainerSizeFromImage}
                onError={handleImageError}
              />
            </Zoom>
          )}
        </div>
      );
    }

    return (
      <div
        className={clsx(
          "media-viewer-container",
          containerMinWidth > 0 &&
            containerMinHeight > 0 &&
            `min-w-[${containerMinWidth}px] min-h-[${containerMinHeight}px]`
        )}
      >
        {videoError && (
          <MediaErrorThumbnail
            className={clsx("media-element", mediaClassName)}
            width={containerMinWidth > 0 ? containerMinWidth : "100%"}
            height={containerMinHeight > 0 ? containerMinHeight : "auto"}
            alt="Video error"
          />
        )}
        {!videoError && (
          <video
            ref={videoRef}
            src={mediaUrl}
            controls
            autoPlay
            muted
            className={clsx("media-element", mediaClassName)}
            onLoadedData={updateContainerSizeFromVideo}
            onError={handleVideoError}
          />
        )}
      </div>
    );
  };

  if (!media) return null;

  return (
    <div className={clsx("media-viewer", className, "relative")}>
      {isFlexibleMedia ? renderFlexibleMedia() : renderSingleMedia()}
      {shouldBlockContent && (
        <>
          {/* Blur overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-20 pointer-events-none" />
          {/* Warning message and accept button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-auto">
            <div className="bg-transparent rounded-2xl p-8 max-w-md mx-4 text-center">
              <div className="mb-0 flex justify-center">
                <Eye className="w-12 h-12 text-white" />
              </div>
              <div className="mb-3">
                <p className="text-lg font-semibold text-white mb-2">
                  Violent or graphic content
                </p>
                <p className="text-sm text-white/90">
                  {sensitiveMessage ||
                    "This photo is covered so people can choose whether they want to see it."}
                </p>
              </div>
              <button
                onClick={onAcceptSensitiveView}
                className="w-full bg-black hover:bg-black/80 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
              >
                View Anyway
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MediaViewer;
