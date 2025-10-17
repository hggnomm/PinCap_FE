import { PRIVACY } from "@/constants/constants";

export interface CreateAlbumRequest {
  album_name: string;
  privacy: string;
  image_cover?: string | File;
}

export interface UpdateAlbumRequest {
  album_name?: string;
  image_cover?: string;
  description?: string;
  privacy?: typeof PRIVACY.PRIVATE | typeof PRIVACY.PUBLIC;
}
