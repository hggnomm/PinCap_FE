import React, { useEffect } from "react";

import { FACEBOOK_LOGIN_SCOPE } from "@/constants/facebook";
import type { FacebookLoginResponse } from "@/types/facebook";
import {
  getFacebookAppId,
  initializeFacebookSDK,
  isFacebookSDKLoaded,
} from "@/utils/facebook-sdk";

export type {
  FacebookAuthResponse,
  FacebookLoginResponse,
} from "@/types/facebook";

interface FacebookLoginButtonProps {
  onSuccess?: (accessToken: string, response: FacebookLoginResponse) => void;
  onError?: (error: string | Error) => void;
  className?: string;
  children?: React.ReactNode;
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
  onSuccess,
  onError,
  className = "",
  children,
}) => {
  useEffect(() => {
    const appId = getFacebookAppId();
    initializeFacebookSDK(appId);
  }, []);

  const handleLogin = () => {
    if (!isFacebookSDKLoaded()) {
      const errorMsg = "Facebook SDK is not loaded";
      console.error(errorMsg);
      onError?.(errorMsg);
      return;
    }

    window.FB.login(
      (response: FacebookLoginResponse) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
          console.log("✅ Access Token:", accessToken);
          console.log("Response:", response);
          onSuccess?.(accessToken, response);
        } else {
          const errorMsg = "User cancelled login or did not fully authorize.";
          console.log("❌", errorMsg);
          onError?.(errorMsg);
        }
      },
      { scope: FACEBOOK_LOGIN_SCOPE }
    );
  };

  return (
    <button
      onClick={handleLogin}
      className={`bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors ${className}`}
    >
      {children || "Login with Facebook"}
    </button>
  );
};

export default FacebookLoginButton;
