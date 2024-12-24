export interface CreateAlbumRequest {
  album_name: string;
  privacy: string;
}

export interface UpdateAlbumRequest {
  album_name: string;
  image_cover?: string;
  description?: string;
  privacy: string;
}
