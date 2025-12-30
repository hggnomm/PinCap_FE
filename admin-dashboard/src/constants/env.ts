const getEnvVar = (key: string): string | undefined => {
  return (import.meta as unknown as { env: Record<string, string> }).env[key];
};

export const ENV = {
  BASE_API: getEnvVar("VITE_BASE_API"),

  ACCESS_TOKEN_KEY: getEnvVar("VITE_ACCESS_TOKEN_KEY") || "token",
  REFRESH_TOKEN_KEY: getEnvVar("VITE_REFRESH_TOKEN_KEY") || "refreshToken",
} as const;

