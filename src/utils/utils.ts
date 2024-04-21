
import jwtdecode from "jwt-decode";

interface IJwtToken {
    id: number;
    exp: number;
    sub: string;
    auth: string;
  }

export const decodedToken = (token: string): IJwtToken | null => {
    if (!token) return null;
    return jwtdecode<IJwtToken>(token);
  };