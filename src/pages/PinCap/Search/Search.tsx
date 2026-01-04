import React, { useState, useCallback, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import MediaList from "@/components/ViewPin/ViewPinComponent";
import { useSearch, SearchFilterType } from "@/hooks/useSearch";

import AlbumSearchList from "./AlbumSearchList";
import EmptySearch from "./EmptySearch";
import ProfileSearchList from "./ProfileSearchList";
import SearchFilterSidebar from "./SearchFilterSidebar";

// Helper function to get filter from URL
const getFilterFromURL = (search: string): SearchFilterType => {
  const searchParams = new URLSearchParams(search);
  const filterParam = searchParams.get("filter");
  if (
    filterParam === "all_media" ||
    filterParam === "albums" ||
    filterParam === "profiles"
  ) {
    return filterParam;
  }
  return "all_media";
};

const Search: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filterType, setFilterType] = useState<SearchFilterType>(() =>
    getFilterFromURL(location.search)
  );
  const [appliedFilter, setAppliedFilter] = useState<SearchFilterType>(() =>
    getFilterFromURL(location.search)
  );

  const {
    imageFile,
    query,
    searchImagePreview,
    imageSearchQueryFn,
    keywordSearchQueryFn,
    profilesQueryFn,
    hasSearchContent,
  } = useSearch(appliedFilter);

  // Update URL when filter changes
  const updateURL = useCallback(
    (filter: SearchFilterType) => {
      const searchParams = new URLSearchParams(location.search);
      if (filter === "all_media") {
        searchParams.delete("filter");
      } else {
        searchParams.set("filter", filter);
      }
      const newSearch = searchParams.toString();
      navigate(
        {
          pathname: location.pathname,
          search: newSearch ? `?${newSearch}` : "",
        },
        { replace: true }
      );
    },
    [navigate, location.pathname, location.search]
  );

  // Sync filter from URL when URL changes
  useEffect(() => {
    const urlFilter = getFilterFromURL(location.search);
    if (urlFilter !== appliedFilter) {
      setAppliedFilter(urlFilter);
      setFilterType(urlFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleFilterChange = useCallback((filter: SearchFilterType) => {
    setFilterType(filter);
  }, []);

  const handleApply = useCallback(() => {
    setAppliedFilter(filterType);
    updateURL(filterType);
  }, [filterType, updateURL]);

  const handleReset = useCallback(() => {
    const defaultFilter: SearchFilterType = "all_media";
    setFilterType(defaultFilter);
    setAppliedFilter(defaultFilter);
    updateURL(defaultFilter);
  }, [updateURL]);

  return (
    <div className="flex gap-6 p-4">
      {/* Filter Sidebar - Only show for keyword search */}
      {!imageFile && (
        <div className="flex-shrink-0">
          <SearchFilterSidebar
            selectedFilter={filterType}
            onFilterChange={handleFilterChange}
            onApply={handleApply}
            onReset={handleReset}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          {imageFile && searchImagePreview && (
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Searching by image:</p>
              <div className="inline-block border border-gray-200 rounded-lg overflow-hidden max-w-xs">
                <img
                  src={searchImagePreview}
                  alt="Search image"
                  className="w-full h-auto max-h-48 object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {!hasSearchContent && <EmptySearch />}

        {imageFile && (
          <MediaList
            queryKey={["searchMediaByImage", imageFile.name]}
            queryFn={imageSearchQueryFn}
          />
        )}

        {!imageFile &&
          query &&
          appliedFilter === "profiles" &&
          profilesQueryFn && (
            <ProfileSearchList
              profilesQueryFn={profilesQueryFn}
              query={query}
            />
          )}

        {!imageFile && query && appliedFilter === "albums" && (
          <AlbumSearchList query={query} />
        )}

        {!imageFile && query && appliedFilter === "all_media" && (
          <MediaList
            queryKey={["searchMedia", query, appliedFilter]}
            queryFn={keywordSearchQueryFn}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
