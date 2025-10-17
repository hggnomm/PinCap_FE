export const ACCESS_TOKEN_KEY = (import.meta as any).env.VITE_ACCESS_TOKEN_KEY || "";
export const REFRESH_TOKEN_KEY = (import.meta as any).env.VITE_REFRESH_TOKEN_KEY || "";

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
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

export const ALBUM_TABS = {
  MY_ALBUMS: "My Albums",
  SHARED_ALBUMS: "Albums Shared with Me",
};

export const ALBUM_ROLES = {
  OWNER: "OWNER",
  EDIT: "EDIT",
  VIEW: "VIEW",
}

export const PRIVACY = {
  PRIVATE: "0",
  PUBLIC: "1"
} as const;

export const MEDIA_TYPES = {
  VIDEO: "VIDEO",
  IMAGE: "IMAGE",
  FLEXIBLE: null,
};
