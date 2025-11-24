import React, { ReactNode } from "react";

import { ClipLoader } from "react-spinners";

import "react-toastify/dist/ReactToastify.css";
import { clsx } from "clsx";

interface LoadingProps {
  isLoading: boolean;
  children: ReactNode;
  blurContent?: boolean;
  overlayStyle?: "light" | "cover" | "none";
}
const Loading: React.FC<LoadingProps> = ({
  isLoading,
  children,
  blurContent = true,
  overlayStyle = "light",
}) => (
  <div className="relative h-full w-full">
    {isLoading && (
      <div
        className={clsx(
          "absolute top-0 left-0 z-50 h-full w-full transition-all",
          {
            "bg-white/80 backdrop-blur": overlayStyle === "cover",
            "bg-white/20 backdrop-blur": overlayStyle === "light",
            "bg-transparent": overlayStyle === "none",
          }
        )}
      />
    )}

    {isLoading && (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <ClipLoader size={40} color={"#A64D79"} loading={isLoading} />
      </div>
    )}

    <div
      className={clsx({
        "blur-sm": isLoading && blurContent,
        "blur-none": !blurContent || !isLoading,
      })}
    >
      {children}
    </div>
  </div>
);

export default Loading;
