import React, { createContext, useContext, useState, ReactNode } from "react";

import { useLocation } from "react-router-dom";

import { Reaction } from "@/types/type";

export interface MediaData {
  id: string;
  media_url: string;
  media_name: string;
  description: string;
  type: string;
  reaction: Reaction;
}

interface MediaToastContextType {
  showToast: (mediaData: MediaData, action: "create" | "update") => void;
  hideToast: () => void;
  isVisible: boolean;
  mediaData: MediaData | null;
  action: "create" | "update" | null;
}

const MediaToastContext = createContext<MediaToastContextType | undefined>(
  undefined
);

export const useMediaToast = () => {
  const context = useContext(MediaToastContext);
  if (!context) {
    throw new Error("useMediaToast must be used within a MediaToastProvider");
  }
  return context;
};

interface MediaToastProviderProps {
  children: ReactNode;
}

export const MediaToastProvider: React.FC<MediaToastProviderProps> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [action, setAction] = useState<"create" | "update" | null>(null);
  const location = useLocation();

  const showToast = (
    newMediaData: MediaData,
    newAction: "create" | "update"
  ) => {
    const isOnMediaDetailPage = location.pathname.includes(
      `/media/${newMediaData.id}`
    );

    if (isOnMediaDetailPage) {
      return;
    }

    setMediaData(newMediaData);
    setAction(newAction);
    setIsVisible(true);
  };

  const hideToast = () => {
    setIsVisible(false);
    setMediaData(null);
    setAction(null);
  };

  return (
    <MediaToastContext.Provider
      value={{
        showToast,
        hideToast,
        isVisible,
        mediaData,
        action,
      }}
    >
      {children}
    </MediaToastContext.Provider>
  );
};
