export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  isFollowing?: boolean;
};

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
  userComments: any | null;
  privacy: string;
  tags_name: string[];
  reaction: {
    id: string;
    feeling_id: string;
  } | null;
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
};
