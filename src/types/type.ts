export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  isFollowing?: boolean;
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
  media_url: string;
  description: string;
  numberUserFollowers: number;
  ownerUser: User;
  reaction_user_count: number | null;
  type: "IMAGE" | "VIDEO";
  userComments: Comment | null;
  privacy: string;
  tags_name: string[];
  reaction: Reaction;
  feelings: Feeling[];
  commentCount: number;
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
  allUser?: User[];
};

export type Tag = {
  id: string;
  tag_name: string;
  latestMediaUrl: string;
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
