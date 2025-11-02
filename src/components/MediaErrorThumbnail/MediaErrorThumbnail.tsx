import React from "react";

import { clsx } from "clsx";

interface MediaErrorThumbnailProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  alt?: string;
  style?: React.CSSProperties;
}

const MediaErrorThumbnail: React.FC<MediaErrorThumbnailProps> = ({
  className,
  width,
  height,
  alt = "Error loading media",
  style,
}) => {
  const widthClass = width
    ? typeof width === "number"
      ? `w-[${width}px]`
      : `w-${width}`
    : "w-full";
  const heightClass = height
    ? typeof height === "number"
      ? `h-[${height}px]`
      : `h-${height}`
    : "h-full";

  return (
    <img
      src="/error-load-media.webp"
      alt={alt}
      className={clsx(
        "object-cover",
        widthClass,
        heightClass,
        "min-w-full",
        "min-h-full",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width || "100%",
        height: typeof height === "number" ? `${height}px` : height || "100%",
        ...style,
      }}
      onError={(e) => {
        // Fallback nếu error image cũng không load được
        const target = e.target as HTMLImageElement;
        target.src = "/placeholder.jpg";
      }}
    />
  );
};

export default MediaErrorThumbnail;
