import React from "react";

import MediaList from "@/components/ViewPin/ViewPinComponent";
import { useSearch } from "@/hooks/useSearch";

import EmptySearch from "./EmptySearch";

const Search: React.FC = () => {
  const {
    imageFile,
    query,
    searchImagePreview,
    imageSearchQueryFn,
    keywordSearchQueryFn,
    hasSearchContent,
  } = useSearch();

  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Search Results
        </h1>
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
        {!imageFile && query && (
          <p className="text-gray-600">
            Showing results for:{" "}
            <span className="font-semibold">&quot;{query}&quot;</span>
          </p>
        )}
      </div>

      {!hasSearchContent && <EmptySearch />}

      {imageFile && (
        <MediaList
          queryKey={["searchMediaByImage", imageFile.name]}
          queryFn={imageSearchQueryFn}
        />
      )}

      {!imageFile && query && (
        <MediaList
          queryKey={["searchMedia", query]}
          queryFn={keywordSearchQueryFn}
        />
      )}
    </div>
  );
};

export default Search;
