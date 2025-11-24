import jwtdecode from "jwt-decode";

import { UploadFile } from "antd";

import angry from "@/assets/img/PinCap/angry.png";
import black_heart from "@/assets/img/PinCap/black-heart.png";
import haha from "@/assets/img/PinCap/haha.png";
import heart from "@/assets/img/PinCap/heart.png";
import sad from "@/assets/img/PinCap/sad.png";
import wow from "@/assets/img/PinCap/wow.png";
import { ALBUM_ROLES, MEDIA_TYPES } from "@/constants/constants";
import { TokenPayload } from "@/types/Auth";
import { Album, AlbumUser } from "@/types/type";

export enum FeelingType {
  HEART = "9bd68a9e-da0e-4889-8656-520818a8dadf",
  HAHA = "9bd68abb-2475-4c39-afcb-10fdbc51854e",
  SAD = "9bd68afe-5bff-4bd5-9f00-a68dfe237899",
  WOW = "9bd68b16-52e5-4239-a6ed-f385cb5ec9bd",
  ANGRY = "9bd68b3e-dc1c-4327-9f23-69d8dc40dcb",
}

export const decodedToken = (token: string | null): TokenPayload | null => {
  if (!token) return null;
  return jwtdecode<TokenPayload>(token);
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

/**
 * Normalize media_url to always be a string array
 * Converts string/null to array format for consistent handling
 * @param mediaUrl - Can be string, array, or null from API
 * @returns Always returns string[] (can be empty)
 */
export const normalizeMediaUrl = (
  mediaUrl: string | string[] | null | undefined
): string[] => {
  if (!mediaUrl) return [];
  if (Array.isArray(mediaUrl)) return mediaUrl;

  // If string, try to parse as JSON array first
  if (typeof mediaUrl === "string") {
    try {
      const parsed = JSON.parse(mediaUrl);
      if (Array.isArray(parsed)) return parsed;
      return [String(parsed)];
    } catch {
      // If not JSON, check if comma-separated
      if (mediaUrl.includes(",")) {
        return mediaUrl
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean);
      }
      // Single URL
      return [mediaUrl];
    }
  }

  return [];
};

export const parseMediaUrl = (
  mediaUrl: string | string[] | null | undefined
): ParsedMediaUrl[] => {
  // Normalize once - no more Array.isArray checks!
  const urls = normalizeMediaUrl(mediaUrl);

  return urls.map((url) => {
    const extension = url.split(".").pop()?.toLowerCase() || "";
    const videoExtensions = ["mp4", "mov", "avi", "mkv", "webm", "flv"];

    return {
      url,
      type: videoExtensions.includes(extension)
        ? MEDIA_TYPES.VIDEO
        : MEDIA_TYPES.IMAGE,
    };
  });
};

/**
 * Lấy URL ảnh đầu tiên từ media có type FLEXIBLE
 * @param mediaUrl - URL string có thể là JSON array hoặc single URL
 * @returns URL ảnh đầu tiên hoặc null nếu không tìm thấy
 */
export const getFirstImageUrl = (
  mediaUrl: string | string[] | null | undefined
): string | null => {
  // Normalize once - no more Array.isArray checks!
  const urls = normalizeMediaUrl(mediaUrl);
  return urls.length > 0 ? urls[0] : null;
};

/**
 * Lấy URL media phù hợp dựa trên type
 * @param mediaUrl - URL của media
 * @param type - Type của media (IMAGE, VIDEO, FLEXIBLE)
 * @returns URL phù hợp để preview
 */
export const getMediaPreviewUrl = (
  mediaUrl: string | string[] | null | undefined,
  type: string | null
): string | null => {
  // Always return first URL - simple!
  return getFirstImageUrl(mediaUrl);
};

/**
 * Kiểm tra xem media có phải là video không
 * @param mediaUrl - URL của media
 * @param type - Type của media
 * @returns true nếu là video
 */
export const isMediaVideo = (
  mediaUrl: string | string[] | null | undefined,
  type: string | null
): boolean => {
  if (type === MEDIA_TYPES.VIDEO) {
    return true;
  }

  // For FLEXIBLE/null type, check first URL
  if (type === null || type === MEDIA_TYPES.FLEXIBLE) {
    const firstUrl = getFirstImageUrl(mediaUrl);
    return firstUrl ? isVideo(firstUrl) : false;
  }

  return false;
};

// Check if current user is the owner of an album
export const isAlbumOwner = (album: Album, currentUserId: string): boolean => {
  if (!album.allUser || !currentUserId) return false;

  const currentUserInAlbum = album.allUser.find(
    (user: AlbumUser) => user.id === currentUserId
  );

  return currentUserInAlbum?.album_role === ALBUM_ROLES.OWNER;
};

/**
 * Tạo aspect ratio ngẫu nhiên nhưng ổn định dựa trên media ID
 * Đảm bảo mỗi media có aspect ratio cố định, tạo hiệu ứng Pinterest
 *
 * @param mediaId - ID của media để tạo hash
 * @param minRatio - Tỷ lệ tối thiểu (default: 0.75 - portrait)
 * @param maxRatio - Tỷ lệ tối đa (default: 1.5 - landscape)
 * @returns Aspect ratio (width/height)
 *
 * @example
 * const aspectRatio = getRandomAspectRatio(media.id); // 0.85
 * <img style={{ aspectRatio: aspectRatio }} />
 */
export const getRandomAspectRatio = (
  mediaId: string | undefined,
  minRatio: number = 0.75,
  maxRatio: number = 1.5
): number => {
  if (!mediaId) {
    // Nếu không có ID, return ratio trung bình
    return 1.0;
  }

  // Tạo hash từ ID để có giá trị ổn định
  let hash = 0;
  for (let i = 0; i < mediaId.length; i++) {
    const char = mediaId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Normalize hash to 0-1 range
  const normalized = Math.abs(hash) / 2147483647;

  // Map to desired ratio range
  const ratio = minRatio + normalized * (maxRatio - minRatio);

  return Math.round(ratio * 100) / 100; // Round to 2 decimal places
};

export const convertBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
