import React, { ReactNode } from "react";

import { ClipLoader } from "react-spinners";

import "react-toastify/dist/ReactToastify.css"; // Import styles
import { clsx } from "clsx";

interface LoadingProps {
  isLoading: boolean;
  children: ReactNode;
}
const Loading: React.FC<LoadingProps> = ({ isLoading, children }) => {
  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full bg-transparent backdrop-blur-sm z-50" />
      )}

      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <ClipLoader size={40} color={"#A64D79"} loading={isLoading} />
        </div>
      )}

      <div className={clsx(isLoading ? "blur-sm" : "blur-none")}>
        {children}
      </div>
    </div>
  );
};

export default Loading;
