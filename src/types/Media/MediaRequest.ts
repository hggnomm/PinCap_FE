export interface MediaFormValues {
  id?: string;
  media?: File | null;
  media_name?: string;
  description?: string;
  privacy: string;
  mediaOwner_id?: string;
  type?: string;
  tags_name?: string[];
  is_created?: boolean;
  is_comment: number;
}
