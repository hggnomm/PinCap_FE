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

export interface PaginatedMediaResponse<T = unknown> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
