import { useEffect, useMemo, useState } from "react";

import { useLocation } from "react-router-dom";

import { getAllMedias, searchMediaByImage } from "@/api/media";
import { EMPTY_PAGINATION_RESPONSE, SEARCH_CONSTANTS } from "@/constants";
import { PaginatedMediaResponse } from "@/types/Media/MediaResponse";

import { Media } from "type";

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
  hasSearchContent: boolean;
}

export const useSearch = (): UseSearchReturn => {
  const location = useLocation();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const stateImage = (location.state as { searchImage?: File })?.searchImage;
    const stateQuery = (location.state as { searchQuery?: string })
      ?.searchQuery;

    if (stateImage) {
      setImageFile(stateImage);
      setQuery("");
      window.history.replaceState({}, document.title);
    } else {
      setImageFile(null);
    }

    if (stateQuery) {
      setQuery(stateQuery);
      window.history.replaceState({}, document.title);
    } else {
      setQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

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

  const keywordSearchQueryFn = useMemo(
    () => (pageParam: number) =>
      getAllMedias({
        query: query,
        page: pageParam,
      }),
    [query]
  );

  const hasSearchContent = Boolean(imageFile || query.trim());

  return {
    imageFile,
    query,
    searchImagePreview,
    imageSearchQueryFn,
    keywordSearchQueryFn,
    hasSearchContent,
  };
};
