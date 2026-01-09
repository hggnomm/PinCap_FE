import React, { Suspense, lazy } from "react";

import { useAlbumToast } from "@/contexts/AlbumToastContext";

const AlbumSuccessToast = lazy(() => import("./AlbumSuccessToast"));

const AlbumToastContainer: React.FC = () => {
  const { isVisible, hideToast, albumData } = useAlbumToast();

  if (!albumData) return null;

  return (
    <Suspense fallback={null}>
      <AlbumSuccessToast
        isVisible={isVisible}
        onClose={hideToast}
        albumData={albumData}
      />
    </Suspense>
  );
};

export default AlbumToastContainer;

