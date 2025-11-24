"use client";

import { useEffect, useMemo } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getInstagramMedias } from "@/api/instagram";
import Loading from "@/components/Loading/Loading";
import { showErrorToast } from "@/utils/apiErrorHandler";

import MediaPost from "./MediaPost";

const PAGE_SIZE = 12;

const PostsList = () => {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["instagram-medias", PAGE_SIZE],
    queryFn: ({ pageParam }) =>
      getInstagramMedias({
        limit: PAGE_SIZE,
        next: typeof pageParam === "string" ? pageParam : undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.paging?.next ?? undefined,
  });

  const posts = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  useEffect(() => {
    if (error) {
      showErrorToast(error, "Unable to load Instagram posts");
    }
  }, [error]);

  return (
    <Loading isLoading={isLoading}>
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 sm:px-10 sm:py-7 lg:px-12 lg:py-8 shadow-sm">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
          Instagram Posts
        </h2>

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 py-16 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-pink-200 border-t-pink-600" />
            <p className="text-gray-600">Loading your Instagram posts...</p>
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <MediaPost key={post.id} post={post} />
              ))}
            </div>

            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="rounded-full border border-pink-200 bg-white px-6 py-2 font-semibold text-pink-600 transition-all hover:border-pink-300 hover:text-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage && (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-pink-200 border-t-pink-600" />
                      Loading...
                    </span>
                  )}
                  {!isFetchingNextPage && "Load more posts"}
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Your Instagram account is connected
            </h3>
            <p className="text-gray-600">
              Sync your content to view the latest posts here.
            </p>
          </div>
        )}
      </div>
    </Loading>
  );
};

export default PostsList;
