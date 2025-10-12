import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import clsx from "clsx";
import { Media } from "@/types/type";
import { parseMediaUrl, ParsedMediaUrl } from "@/utils/utils";
import { MEDIA_TYPES } from "@/constants/constants";
import DotsPagination from "@/components/dotsPagination/DotsPagination";
import "./MediaViewer.less";

interface MediaViewerProps {
  media: Media | null;
  className?: string;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ media, className }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  const isFlexibleMedia = useMemo(() => {
    const isFlexible = media?.type === null;
    return isFlexible;
  }, [media?.type]);

  const flexibleMediaUrls: ParsedMediaUrl[] = useMemo(() => {
    const urls = isFlexibleMedia ? parseMediaUrl(media?.media_url) : [];
    return urls;
  }, [isFlexibleMedia, media?.media_url, media?.type]);

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
  }, [media?.id]);

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
      
      if (e.key === 'ArrowLeft' && !isFirstMedia) {
        handlePrevMedia();
      } else if (e.key === 'ArrowRight' && !isLastMedia) {
        handleNextMedia();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasMultipleMedia, handlePrevMedia, handleNextMedia, isFirstMedia, isLastMedia]);

  const renderFlexibleMedia = () => {
    if (!isFlexibleMedia || flexibleMediaUrls.length === 0) return null;

    const currentMedia = flexibleMediaUrls[currentMediaIndex];
    const variants = {
      enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.95,
      }),
      center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
      },
      exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        scale: 0.95,
      }),
    };

    return (
      <div
        className="media-viewer-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={`${media?.id}-${currentMediaIndex}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.2, ease: "easeInOut" },
                scale: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
              }}
              className="media-content relative"
              style={{
                borderRadius: "28px",
                overflow: "hidden"
              }}
            >
            {currentMedia.type === MEDIA_TYPES.VIDEO ? (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                muted
                className="media-element"
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  borderRadius: "28px" 
                }}
                onLoadStart={() => setIsImageLoaded(false)}
                onLoadedData={() => setIsImageLoaded(true)}
              />
            ) : (
              <Zoom>
                  <img
                    src={currentMedia.url}
                    alt={media?.media_name}
                    className={clsx(
                      "media-element",
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '80vh',
                      borderRadius: "28px",
                      transition: "opacity 0.2s ease-in-out",
                    }}
                    onLoad={() => setIsImageLoaded(true)}
                    onLoadStart={() => setIsImageLoaded(false)}
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
                "absolute top-1/2 -translate-y-1/2 rounded-full p-3 shadow-lg transition-all z-10 border-none",
                "!bg-white/90 hover:!bg-white active:scale-95",
                "left-4",
                {
                  "bg-gray-300 cursor-not-allowed opacity-50": isFirstMedia,
                }
              )}
              aria-label="Previous media"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={handleNextMedia}
              disabled={isLastMedia}
              className={clsx(
                "absolute top-1/2 -translate-y-1/2 rounded-full p-3 shadow-lg transition-all z-10 border-none",
                "!bg-white/90 hover:!bg-white active:scale-95",
                "right-4",
                {
                  "bg-gray-300 cursor-not-allowed opacity-50": isLastMedia,
                }
              )}
              aria-label="Next media"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </>
        )}
      </div>
    );
  };

  const renderSingleMedia = () => {
    if (!media) return null;

    if (media.type === MEDIA_TYPES.IMAGE) {
      return (
        <div className="media-viewer-container">
          <Zoom>
            <img 
              src={media.media_url} 
              alt={media.media_name} 
              className="media-element"
              style={{ 
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: "28px" 
              }}
            />
          </Zoom>
        </div>
      );
    }

    return (
      <div className="media-viewer-container">
        <video 
          src={media.media_url} 
          controls 
          autoPlay 
          muted 
          className="media-element"
          style={{ 
            maxWidth: '100%',
            maxHeight: '80vh',
            borderRadius: "28px" 
          }}
        />
      </div>
    );
  };

  if (!media) return null;

  return (
    <div className={clsx("media-viewer", className)}>
      {isFlexibleMedia ? renderFlexibleMedia() : renderSingleMedia()}
    </div>
  );
};

export default MediaViewer;
