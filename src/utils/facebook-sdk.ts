import { ENV } from "@/constants/env";
import type { FacebookLoginResponse } from "@/types/facebook";

interface FacebookSDKConfig {
  appId: string;
  cookie: boolean;
  xfbml: boolean;
  version: string;
}

interface FacebookSDK {
  init: (config: FacebookSDKConfig) => void;
  login: (
    callback: (response: FacebookLoginResponse) => void,
    options?: { scope: string }
  ) => void;
}

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: FacebookSDK;
  }
}

export const initializeFacebookSDK = (appId: string): void => {
  if (!appId) {
    console.error("Facebook App ID is not configured");
    return;
  }

  window.fbAsyncInit = function () {
    window.FB.init({
      appId: appId,
      cookie: true,
      xfbml: true,
      version: "v20.0",
    });
  };

  if (document.getElementById("facebook-jssdk")) {
    return;
  }

  const fjs = document.getElementsByTagName("script")[0];
  const js = document.createElement("script") as HTMLScriptElement;
  js.id = "facebook-jssdk";
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  js.async = true;
  js.defer = true;
  fjs.parentNode!.insertBefore(js, fjs);
};

export const isFacebookSDKLoaded = (): boolean => {
  return typeof window !== "undefined" && typeof window.FB !== "undefined";
};

export const getFacebookAppId = (): string => {
  return ENV.FACEBOOK_APP_ID || "";
};
