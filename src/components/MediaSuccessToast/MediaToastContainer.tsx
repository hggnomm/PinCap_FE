import React from "react";

import { useMediaToast } from "@/contexts/MediaToastContext";

import MediaSuccessToast from "./MediaSuccessToast";

const MediaToastContainer: React.FC = () => {
  const { isVisible, hideToast, mediaData, action } = useMediaToast();

  if (!mediaData || !action) return null;

  return (
    <MediaSuccessToast
      isVisible={isVisible}
      onClose={hideToast}
      mediaData={mediaData}
      action={action}
    />
  );
};

export default MediaToastContainer;
