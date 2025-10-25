import React, { useEffect, ReactNode } from "react";

import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

interface LoadingSpinnerProps {
  isLoading: boolean;
  isOpenSuccess?: boolean;
  successMessage?: string;
  children: ReactNode;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  isLoading,
  isOpenSuccess = false,
  successMessage,
  children,
}) => {
  useEffect(() => {
    if (isOpenSuccess && successMessage) {
      toast.success(successMessage);
    }
  }, [isOpenSuccess, successMessage]);

  return (
    <div>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#A64D79",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <ClipLoader size={50} color={"#fff"} loading={isLoading} />
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default LoadingSpinner;
