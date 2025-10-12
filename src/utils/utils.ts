import { UploadFile } from "antd";
import jwtdecode from "jwt-decode";

import haha from "../assets/img/PinCap/haha.png";
import sad from "../assets/img/PinCap/sad.png";
import angry from "../assets/img/PinCap/angry.png";
import heart from "../assets/img/PinCap/heart.png";
import wow from "../assets/img/PinCap/wow.png";
import black_heart from "../assets/img/PinCap/black-heart.png";
import { MEDIA_TYPES } from "@/constants/constants";

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

export const isVideo = (url: string) => {
  const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv"];
  return videoExtensions.some((ext) => url.endsWith(ext));
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

export const formatTime = (dateString: string): string => {
  const pastDate = new Date(dateString);
  const now = new Date();
  const totalSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  const ONE_MINUTE = 60;
  const ONE_HOUR = ONE_MINUTE * 60;
  const ONE_DAY = ONE_HOUR * 24;
  const ONE_WEEK = ONE_DAY * 7;
  const ONE_YEAR = ONE_DAY * 365;

  if (totalSeconds < ONE_MINUTE) {
    return "Just now";
  }

  // Calculate each time unit
  const years = Math.floor(totalSeconds / ONE_YEAR);
  const weeks = Math.floor((totalSeconds % ONE_YEAR) / ONE_WEEK);
  const days = Math.floor((totalSeconds % ONE_WEEK) / ONE_DAY);
  const hours = Math.floor((totalSeconds % ONE_DAY) / ONE_HOUR);
  const minutes = Math.floor((totalSeconds % ONE_HOUR) / ONE_MINUTE);
  const seconds = Math.floor(totalSeconds % ONE_MINUTE);

  // Return two most significant units
  if (years > 0) {
    if (weeks > 0) return `${years}y ${weeks}w`;
    if (days > 0) return `${years}y ${days}d`;
    return `${years}y`;
  }

  if (weeks > 0) {
    if (days > 0) return `${weeks}w ${days}d`;
    return `${weeks}w`;
  }

  if (days > 0) {
    if (hours > 0) return `${days}d ${hours}h`;
    return `${days}d`;
  }

  if (hours > 0) {
    if (minutes > 0) return `${hours}h ${minutes}m`;
    return `${hours}h`;
  }

  if (minutes > 0) {
    if (seconds > 0) return `${minutes}m ${seconds}s`;
    return `${minutes}m`;
  }

  return `${seconds}s`;
};

export interface ParsedMediaUrl {
  url: string;
  type: typeof MEDIA_TYPES.IMAGE | typeof MEDIA_TYPES.VIDEO;
}

export const parseMediaUrl = (mediaUrl: string | null | undefined): ParsedMediaUrl[] => {
  if (!mediaUrl) {
    return [];
  }

  let urls: string[] = [];

  try {
    const parsed = JSON.parse(mediaUrl);
    if (Array.isArray(parsed)) {
      urls = parsed;
    } else {
      urls = [String(parsed)];
    }
  } catch {
    urls = mediaUrl
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
  }

  return urls.reduce<ParsedMediaUrl[]>((acc, url) => {
    const parts = url.split(".");
    const extension = parts[parts.length - 1].toLowerCase();
    
    const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv"];
    const type = videoExtensions.includes(extension) ? MEDIA_TYPES.VIDEO : MEDIA_TYPES.IMAGE;
    
    acc.push({ url, type });
    return acc;
  }, []);
};