import React from "react";

import { useSearchParams } from "react-router-dom";

import { getAllMedias } from "@/api/media";
import Empty from "@/components/Empty";
import MediaList from "@/components/viewPin/ViewPinComponent";
import { SEARCH_CONSTANTS, SEARCH_PARAMS } from "@/constants";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get(SEARCH_PARAMS.SEARCH) || "";

  if (!query || query.length < SEARCH_CONSTANTS.MIN_SEARCH_LENGTH) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Search Results
          </h1>
          <p className="text-gray-600">
            Please enter at least {SEARCH_CONSTANTS.MIN_SEARCH_LENGTH}{" "}
            characters to search
          </p>
        </div>
        <Empty />
      </div>
    );
  }

  return (
    <div className="">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Search Results
        </h1>
        <p className="text-gray-600">
          Showing results for:{" "}
          <span className="font-semibold">&quot;{query}&quot;</span>
        </p>
      </div>

      <MediaList
        queryKey={["searchMedia", query]}
        queryFn={(pageParam) =>
          getAllMedias({
            query: query,
            page: pageParam,
          })
        }
      />
    </div>
  );
};

export default Search;
