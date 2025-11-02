const getEnvVar = (key: string): string | undefined => {
  return (import.meta as unknown as { env: Record<string, string> }).env[key];
};

export const ENV = {
  BASE_API: getEnvVar("VITE_BASE_API"),

  GOOGLE_CLOUD_API_KEY: getEnvVar("VITE_GOOGLE_CLOUD_API_KEY"),
  GEMINI_API_KEY: getEnvVar("VITE_GEMINI_API_KEY"),

  IS_OPEN_SAFE_CHECK_MEDIA:
    getEnvVar("VITE_IS_OPEN_SAFE_CHECK_MEDIA") === "true",

  ACCESS_TOKEN_KEY: getEnvVar("VITE_ACCESS_TOKEN_KEY") || "",
  REFRESH_TOKEN_KEY: getEnvVar("VITE_REFRESH_TOKEN_KEY") || "",

  FACEBOOK_APP_ID: getEnvVar("VITE_FACEBOOK_APP_ID") || "",
} as const;
