export interface MediaResponse {
  message: string;
  media: {
    id: string;
    media_url: string;
    media_name: string;
    description: string | null;
    type: string;
    reaction: string | null;
  };
}

