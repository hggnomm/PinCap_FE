import { UploadFile } from "antd";
import jwtdecode from "jwt-decode";

interface IJwtToken {
  id: number;
  exp: number;
  sub: string;
  auth: string;
}

export const decodedToken = (token: any): IJwtToken | null => {
  if (!token) return null;
  return jwtdecode<IJwtToken>(token);
};

export const isImageFile = (file: UploadFile): boolean => {
  const extensions = ["jpg", "jpeg", "png", "gif", "bmp"];
  const extension = getFileExtension(file.name);
  return extensions.includes(extension.toLowerCase());
};

export const isMp4File = (file: UploadFile): boolean => {
  const extensions = ["mp4"];
  const extension = getFileExtension(file.name);
  return extensions.includes(extension.toLowerCase());
};

export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split(".");
  return parts[parts.length - 1];
};
