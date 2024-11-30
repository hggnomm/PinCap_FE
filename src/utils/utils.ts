import { UploadFile } from "antd";
import jwtdecode from "jwt-decode";

import haha from "../assets/img/PinCap/haha.png";
import sad from "../assets/img/PinCap/sad.png";
import angry from "../assets/img/PinCap/angry.png";
import heart from "../assets/img/PinCap/heart.png";
import wow from "../assets/img/PinCap/wow.png";
import black_heart from "../assets/img/PinCap/black-heart.png";

export enum FeelingType {
  HEART = "9bd68a9e-da0e-4889-8656-520818a8dadf",
  HAHA = "9bd68abb-2475-4c39-afcb-10fdbc51854e",
  SAD = "9bd68afe-5bff-4bd5-9f00-a68dfe237899",
  WOW = "9bd68b16-52e5-4239-a6ed-f385cb5ec9bd",
  ANGRY = "9bd68b3e-dc1c-4327-9f23-69d8dc40dcb",
}

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

export const getImageReactionWithId = (id?: string): string => {
  switch (id) {
    case FeelingType.HEART:
      return heart;
    case FeelingType.HAHA:
      return haha;
    case FeelingType.SAD:
      return sad;
    case FeelingType.WOW:
      return wow;
    case FeelingType.ANGRY:
      return angry;
    default:
      return black_heart;
  }
};
