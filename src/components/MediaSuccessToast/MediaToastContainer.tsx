import React, { Suspense, lazy } from "react";

import { useMediaToast } from "@/contexts/MediaToastContext";

const MediaSuccessToast = lazy(() => import("./MediaSuccessToast"));

const MediaToastContainer: React.FC = () => {
  const { isVisible, hideToast, mediaData, action } = useMediaToast();

  if (!mediaData || !action) return null;

  return (
    <Suspense fallback={null}>
      <MediaSuccessToast
        isVisible={isVisible}
        onClose={hideToast}
        mediaData={mediaData}
        action={action}
      />
    </Suspense>
  );
};

export default MediaToastContainer;
