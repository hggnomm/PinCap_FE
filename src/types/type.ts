import { ALBUM_ROLES, ALBUM_INVITATION_STATUS } from "@/constants/constants";

export type SocialInstagram = {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  permalink: string;
  social_id: string;
};

export type User = {
  id: string;
  added_by_user_id?: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  avatar: string;
  background?: string;
  phone?: string | null;
  bio?: string | null;
  role?: string;
  followers_count?: number;
  followees_count?: number;
  medias_count?: number;
  reaction_media_count?: number;
  isFollowing?: boolean;
  social_instagram?: SocialInstagram;
};

export type AlbumUser = User & {
  name: string;
  album_role: keyof typeof ALBUM_ROLES;
  status: keyof typeof ALBUM_INVITATION_STATUS;
  invitation_status: keyof typeof ALBUM_INVITATION_STATUS;
};

export type Feeling = {
  id: string;
  feeling_type: string;
  icon_url: string;
};

export type Reaction = {
  id: string;
  feeling_id: string;
} | null;

export type Comment = {
  id: string;
  content: string;
  image_url: string;
  created_at: string;
  feelings: Feeling[];
  all_feelings_count: number;
  name: string;
  is_following: boolean;
  user_id: string;
  avatar: string;
  replies_count: number;
} | null;

export type Media = {
  id: string;
  is_comment: boolean;
  is_created: boolean;
  media_name: string;
  media_url: string | string[] | null;
  description: string;
  numberUserFollowers: number;
  ownerUser: User;
  reaction_user_count: number | null;
  type: "IMAGE" | "VIDEO" | null;
  userComments: Comment | null;
  privacy: string;
  tags: Tag[];
  reaction: Reaction;
  feelings: Feeling[];
  commentCount: number;
  safe_search_data?: Record<string, unknown> | null;
  is_policy_violation?: boolean;
  created_at?: string;
  updated_at?: string;
  added_by_user?: User;
  media_owner_id?: string;
};

export type Album = {
  id: string;
  image_cover: string | null;
  album_name: string;
  description: string | null;
  privacy: string;
  medias_count: number;
  created_at: string;
  updated_at: string;
  users: User[];
  medias: Media[];
  allUser?: AlbumUser[];
};

export type Tag = {
  id: string;
  tag_name?: string;
  latestMediaUrl?: string;
};

export type ReportReason = {
  id: string;
  title: string;
  description: string;
};

export type Notification = {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  link: string;
  notification_type: string;
  created_at: string;
  sender: {
    id: string;
    name: string | null;
    avatar: string;
  };
};

export type UserReaction = {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  is_following?: boolean;
  feeling?: Feeling;
};

export type PrivacyOptions = {
  PUBLIC: number;
  PRIVATE: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type MediaFeeling = {
  id: string;
  feeling_type: string;
  icon_url: string;
  total: number;
};
