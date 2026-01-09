import { ENV } from "./env";

export const ACCESS_TOKEN_KEY = ENV.ACCESS_TOKEN_KEY;
export const REFRESH_TOKEN_KEY = ENV.REFRESH_TOKEN_KEY;

export const NOTIFICATION_TYPES = {
  MEDIA_CREATED: "MEDIA_CREATED",
  ALBUM_INVITATION: "ALBUM_INVITATION",
  USER_FOLLOWED: "USER_FOLLOWED",
  MEDIA_REACTION: "MEDIA_REACTION",
  COMMENT_REACTION: "COMMENT_REACTION",
  COMMENT: "COMMENT",
  COMMENT_REPLY: "COMMENT_REPLY",
  MEDIA_ADD_GROUP_ALBUM: "MEDIA_ADD_GROUP_ALBUM",
} as const;

export const NOTIFICATION_STATUS = {
  READ: 1,
  UNREAD: 0,
} as const;

export const ALBUM_INVITATION_STATUS = {
  INVITED: "INVITED",
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;

export const ALBUM_TABS = {
  MY_ALBUMS: "My Albums",
  SHARED_ALBUMS: "Albums Shared with Me",
};

export const ALBUM_ROLES = {
  OWNER: "OWNER",
  EDIT: "EDIT",
  VIEW: "VIEW",
};

export const PRIVACY = {
  PRIVATE: "0",
  PUBLIC: "1",
} as const;

export const MEDIA_TYPES = {
  VIDEO: "VIDEO",
  IMAGE: "IMAGE",
  FLEXIBLE: null,
  // FLEXIBLE MEDIA TYPES IS ARRAY OF MEDIA TYPES LIKES
  // "[\"https:\\/\\/pincap.s3.ap-southeast-1.amazonaws.com\\/Medias\\/Image\\/1760702415-z6703733586885_cbc333e3c0161e0613dfd5f22a5c5bab.jpg\",\"https:\\/\\/pincap.s3.ap-southeast-1.amazonaws.com\\/Medias\\/Image\\/1760702415-z6703733534203_1da507f170e5820f45beb9b78ba14664.jpg\",\"https:\\/\\/pincap.s3.ap-southeast-1.amazonaws.com\\/Medias\\/Image\\/1760702415-z6703736889409_61f264815eccb2ee20b3a921a1b0d7af.jpg\"]"
} as const;

// Media type values for API requests (IMAGE = 0, VIDEO = 1)
export const MEDIA_TYPE_VALUES = {
  IMAGE: "0",
  VIDEO: "1",
} as const;
