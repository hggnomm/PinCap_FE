import React, { createContext, useContext, useState, ReactNode } from "react";

import { useLocation } from "react-router-dom";

export interface AlbumData {
  id: string;
  album_name: string;
  image_cover: string | null;
  privacy: string;
  medias_count?: number;
}

interface AlbumToastContextType {
  showToast: (albumData: AlbumData) => void;
  hideToast: () => void;
  isVisible: boolean;
  albumData: AlbumData | null;
}

const AlbumToastContext = createContext<AlbumToastContextType | undefined>(
  undefined
);

export const useAlbumToast = () => {
  const context = useContext(AlbumToastContext);
  if (!context) {
    throw new Error("useAlbumToast must be used within an AlbumToastProvider");
  }
  return context;
};

interface AlbumToastProviderProps {
  children: ReactNode;
}

export const AlbumToastProvider: React.FC<AlbumToastProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [albumData, setAlbumData] = useState<AlbumData | null>(null);
  const location = useLocation();

  const showToast = (newAlbumData: AlbumData) => {
    const isOnAlbumDetailPage = location.pathname.includes(
      `/album/${newAlbumData.id}`
    );

    if (isOnAlbumDetailPage) {
      return;
    }

    setAlbumData(newAlbumData);
    setIsVisible(true);
  };

  const hideToast = () => {
    setIsVisible(false);
    setAlbumData(null);
  };

  return (
    <AlbumToastContext.Provider
      value={{
        showToast,
        hideToast,
        isVisible,
        albumData,
      }}
    >
      {children}
    </AlbumToastContext.Provider>
  );
};

