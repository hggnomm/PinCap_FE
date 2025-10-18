import React from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchMedia } from "@/react-query/useSearchMedia";
import { SEARCH_CONSTANTS, SEARCH_PARAMS } from "@/constants";
import Empty from "@/components/Empty";
import Loading from "@/components/loading/Loading";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();

  const query = searchParams.get(SEARCH_PARAMS.SEARCH) || "";
  const page = parseInt(
    searchParams.get(SEARCH_PARAMS.PAGE) ||
      SEARCH_CONSTANTS.DEFAULT_PAGE.toString()
  );
  const perPage = parseInt(
    searchParams.get(SEARCH_PARAMS.PER_PAGE) ||
      SEARCH_CONSTANTS.DEFAULT_PER_PAGE.toString()
  );

  const {
    data: searchResults,
    isLoading: loading,
    error,
    isError,
  } = useSearchMedia({
    search: query,
    page,
    per_page: perPage,
  });

  const renderMedia = () => {
    // Show loading
    if (loading) {
      return (
        <Loading isLoading={loading}>
          <div />
        </Loading>
      );
    }

    // Show empty if no query
    if (!query) {
      return <Empty />;
    }

    // Show empty for 404 or no results
    if (isError && error?.response?.status === 404) {
      return <Empty />;
    }

    // Show empty if no data or empty array
    if (!searchResults?.data || searchResults.data.length === 0) {
      return <Empty />;
    }

    // Show results
    return (
      <div>
        <div className="mb-4">
          <p className="text-gray-600">
            Found {searchResults.total || 0} results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {searchResults.data.map((item, index: number) => (
            <div
              key={item.id || index}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <h3 className="font-semibold text-gray-900 mb-2">
                {item.media_name || `Media ${item.id}`}
              </h3>
              <p className="text-gray-600 text-sm">ID: {item.id}</p>
              {item.description && (
                <p className="text-gray-500 text-sm mt-2">{item.description}</p>
              )}
              {item.media_url && (
                <div className="mt-3">
                  <img
                    src={item.media_url}
                    alt={item.media_name}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Search Results
        </h1>

        {query && (
          <p className="text-gray-600">
            Showing results for:{" "}
            <span className="font-semibold">"{query}"</span>
          </p>
        )}
      </div>

      {renderMedia()}
    </div>
  );
};

export default Search;
