import { MEDIA_TYPE_VALUES } from "@/constants/constants";

export interface GetAllMediasRequest {
  per_page?: number;
  page?: number;
  /** Search keyword to filter media by user_name, title, description, or tag name */
  query?: string;
  order_key?: string;
  order_type?: string;
  type?: MediaTypeValue;
}

export type MediaTypeValue =
  (typeof MEDIA_TYPE_VALUES)[keyof typeof MEDIA_TYPE_VALUES];

export enum OrderType {
  ASC = "asc",
  DESC = "desc",
}

export enum OrderKey {
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
  MEDIA_NAME = "media_name",
  DESCRIPTION = "description",
}

export interface GetAllMediasRequestExtended extends GetAllMediasRequest {
  order_type?: OrderType;
  order_key?: OrderKey;
}

export const DEFAULT_GET_ALL_MEDIAS_REQUEST: Partial<GetAllMediasRequest> = {
  per_page: 15,
  page: 1,
  order_type: OrderType.DESC,
  order_key: OrderKey.CREATED_AT,
};
