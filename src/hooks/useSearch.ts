import { useEffect, useMemo, useState } from "react";

import { useLocation } from "react-router-dom";

import { getAllAlbums } from "@/api/album";
import { getAllMedias, searchMediaByImage } from "@/api/media";
import { findUsers } from "@/api/users";
import { EMPTY_PAGINATION_RESPONSE, SEARCH_CONSTANTS } from "@/constants";
import { PaginatedMediaResponse } from "@/types/Media/MediaResponse";
import { Album, Media, User, PaginatedResponse } from "@/types/type";

export type SearchFilterType = "all_media" | "albums" | "profiles";

interface UseSearchReturn {
  imageFile: File | null;
  query: string;
  searchImagePreview: string | null;
  imageSearchQueryFn: (
    pageParam: number
  ) => Promise<PaginatedMediaResponse<Media>>;
  keywordSearchQueryFn: (
    pageParam: number
  ) => Promise<PaginatedMediaResponse<Media>>;
  profilesQueryFn?: () => Promise<User[]>;
  albumsQueryFn?: () => Promise<PaginatedResponse<Album>>;
  hasSearchContent: boolean;
}

export const useSearch = (
  filterType: SearchFilterType = "all_media"
): UseSearchReturn => {
  const location = useLocation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [query, setQuery] = useState<string>("");
  const [currentFilterType, setCurrentFilterType] =
    useState<SearchFilterType>(filterType);

  // Sync filterType when it changes externally
  useEffect(() => {
    setCurrentFilterType(filterType);
  }, [filterType]);

  useEffect(() => {
    const stateImage = (location.state as { searchImage?: File })?.searchImage;
    const stateQuery = (location.state as { searchQuery?: string })
      ?.searchQuery;

    const searchParams = new URLSearchParams(location.search);
    const urlQuery = searchParams.get("search") || "";

    if (stateImage) {
      setImageFile(stateImage);
      setQuery("");
      window.history.replaceState({}, document.title);
    } else {
      setImageFile(null);
    }

    // Priority: stateQuery > urlQuery > empty
    if (stateQuery) {
      setQuery(stateQuery);
      window.history.replaceState({}, document.title);
    } else if (urlQuery) {
      setQuery(urlQuery);
    } else {
      setQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, location.search]);

  const searchImagePreview = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (searchImagePreview) {
        URL.revokeObjectURL(searchImagePreview);
      }
    };
  }, [searchImagePreview]);

  const imageSearchQueryFn = useMemo(() => {
    if (!imageFile) {
      return () =>
        Promise.resolve({
          ...EMPTY_PAGINATION_RESPONSE,
          data: [],
        });
    }

    return (pageParam: number) =>
      searchMediaByImage({
        image: imageFile,
        page: pageParam,
        per_page: SEARCH_CONSTANTS.DEFAULT_PER_PAGE,
      });
  }, [imageFile]);

  const albumsQueryFn = useMemo(() => {
    if (!query.trim() || currentFilterType !== "albums") {
      return undefined;
    }

    return async (): Promise<PaginatedResponse<Album>> => {
      try {
        const albumsResponse = await getAllAlbums({
          query: query,
          page: 1,
          per_page: SEARCH_CONSTANTS.DEFAULT_PER_PAGE,
        });
        return albumsResponse as PaginatedResponse<Album>;
      } catch (error) {
        console.error("Error fetching albums:", error);
        return {
          current_page: 1,
          last_page: 1,
          per_page: SEARCH_CONSTANTS.DEFAULT_PER_PAGE,
          total: 0,
          data: [],
        } as PaginatedResponse<Album>;
      }
    };
  }, [query, currentFilterType]);

  const keywordSearchQueryFn = useMemo(() => {
    if (!query.trim()) {
      return () =>
        Promise.resolve({
          ...EMPTY_PAGINATION_RESPONSE,
          data: [],
        });
    }

    return async (pageParam: number) => {
      switch (currentFilterType) {
        case "profiles": {
          // Use findUsers with albumId as null/undefined for profile search
          const usersResponse = await findUsers(query, null);
          // Transform users response to match Media response format
          // Note: This is a workaround - you may want to create a separate component for user results
          const users = Array.isArray(usersResponse)
            ? usersResponse
            : (usersResponse as PaginatedResponse<User>).data || [];
          return {
            current_page: 1,
            last_page: 1,
            per_page: users.length,
            total: users.length,
            data: users.map((user) => ({
              id: user.id,
              is_comment: false,
              is_created: false,
              media_name: user.name || user.email || "",
              description: user.bio || "",
              media_url: user.avatar || null,
              numberUserFollowers: user.followers_count || 0,
              ownerUser: user,
              reaction_user_count: null,
              type: "IMAGE" as const,
              userComments: null,
              privacy: "1", // Public
              tags: [],
              reaction: null,
              feelings: [],
              commentCount: 0,
              created_at: "",
              updated_at: "",
            })) as Media[],
          } as PaginatedMediaResponse<Media>;
        }
        case "all_media":
        default:
          return getAllMedias({
            query: query,
            page: pageParam,
            per_page: SEARCH_CONSTANTS.DEFAULT_PER_PAGE,
          });
      }
    };
  }, [query, currentFilterType]);

  const profilesQueryFn = useMemo(() => {
    if (!query.trim() || currentFilterType !== "profiles") {
      return undefined;
    }

    return async (): Promise<User[]> => {
      try {
        // Use findUsers with albumId as null/undefined for profile search
        const usersResponse = await findUsers(query, null);
        const users = Array.isArray(usersResponse)
          ? usersResponse
          : (usersResponse as PaginatedResponse<User>).data || [];
        return users;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    };
  }, [query, currentFilterType]);

  const hasSearchContent = Boolean(imageFile || query.trim());

  return {
    imageFile,
    query,
    searchImagePreview,
    imageSearchQueryFn,
    keywordSearchQueryFn,
    profilesQueryFn,
    albumsQueryFn,
    hasSearchContent,
  };
};
