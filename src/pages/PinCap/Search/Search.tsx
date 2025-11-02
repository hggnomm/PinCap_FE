import React from "react";

import { useSearchParams } from "react-router-dom";

import { getAllMedias } from "@/api/media";
import MediaList from "@/components/ViewPin/ViewPinComponent";
import { SEARCH_PARAMS } from "@/constants";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get(SEARCH_PARAMS.SEARCH) || "";

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
