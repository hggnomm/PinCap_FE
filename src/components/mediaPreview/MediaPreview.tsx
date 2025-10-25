import React from "react";

import { Media } from "@/types/type";
import { getMediaPreviewUrl, isMediaVideo } from "@/utils/utils";

interface MediaPreviewProps {
  media: Media;
  className?: string;
  alt?: string;
  onError?: (
    e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>
  ) => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  media,
  className = "",
  alt,
  onError,
}) => {
  const mediaUrl = getMediaPreviewUrl(media.media_url ?? "", media.type ?? "");
  const isVideo = isMediaVideo(media.media_url ?? "", media.type ?? "");

  const handleError = (
    e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>
  ) => {
    const target = e.target as HTMLImageElement | HTMLVideoElement;
    if (target instanceof HTMLImageElement) {
      target.src = "/placeholder.jpg";
    }
    onError?.(e);
  };

  if (!mediaUrl) {
    return (
      <img
        src="/placeholder.jpg"
        alt={alt || media.media_name || "Media Item"}
        className={className}
        onError={handleError}
      />
    );
  }

  if (isVideo) {
    return (
      <video
        className={className}
        muted
        playsInline
        preload="metadata"
        onError={handleError}
      >
        <source src={mediaUrl} type="video/mp4" />
      </video>
    );
  }

  return (
    <img
      src={mediaUrl}
      alt={alt || media.media_name || "Media Item"}
      className={className}
      onError={handleError}
    />
  );
};

export default MediaPreview;
