import React from "react";

import { useAlbumToast } from "@/contexts/AlbumToastContext";

import AlbumSuccessToast from "./AlbumSuccessToast";

const AlbumToastContainer: React.FC = () => {
  const { isVisible, hideToast, albumData } = useAlbumToast();

  if (!albumData) return null;

  return (
    <AlbumSuccessToast
      isVisible={isVisible}
      onClose={hideToast}
      albumData={albumData}
    />
  );
};

export default AlbumToastContainer;
