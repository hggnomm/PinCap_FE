export const INSTAGRAM_MEDIA_TYPES = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  CAROUSEL_ALBUM: "CAROUSEL_ALBUM",
} as const;

export type InstagramMediaType =
  (typeof INSTAGRAM_MEDIA_TYPES)[keyof typeof INSTAGRAM_MEDIA_TYPES];

export type InstagramMediaChild = {
  id: string;
  media_type: InstagramMediaType;
  media_url: string;
};

export type InstagramMedia = {
  id: string;
  caption?: string | null;
  media_type: InstagramMediaType;
  media_url: string;
  permalink: string;
  is_synced: boolean;
  children?: {
    data: InstagramMediaChild[];
  };
};

export type InstagramPaging = {
  cursors: {
    before?: string | null;
    after?: string | null;
  };
  previous?: string | null;
  next?: string | null;
};

export type InstagramMediasResponse = {
  data: InstagramMedia[];
  paging: InstagramPaging;
};
