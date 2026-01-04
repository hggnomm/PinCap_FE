import React, { useEffect } from "react";

import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Col, Row } from "antd";

import { getAllAlbums } from "@/api/album";
import { SEARCH_CONSTANTS } from "@/constants";
import AlbumCard from "@/pages/PinCap/MyAlbum/AlbumCard/AlbumCard";
import { Album, PaginatedResponse } from "@/types/type";
import { useSelector } from "react-redux";
import { TokenPayload } from "@/types/Auth";
import Loading from "@/components/Loading/Loading";
import Empty, { NoMediaIcon } from "@/components/Empty";

interface AlbumSearchListProps {
  query: string;
}

const AlbumSearchList: React.FC<AlbumSearchListProps> = ({ query }) => {
  const tokenPayload = useSelector(
    (state: { auth: TokenPayload }) => state.auth
  );
  const { ref, inView } = useInView();

  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["searchAlbums", query],
    queryFn: async ({ pageParam = 1 }) => {
      const albumsResponse = await getAllAlbums({
        query: query,
        page: pageParam,
        per_page: SEARCH_CONSTANTS.DEFAULT_PER_PAGE,
      });
      return albumsResponse as PaginatedResponse<Album>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    enabled: !!query.trim(),
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const albums = data?.pages.flatMap((page) => page.data) || [];

  if (status === "pending" || (isFetching && albums.length === 0)) {
    return (
      <Loading isLoading={true}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading albums...</div>
        </div>
      </Loading>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">
          Error loading albums. Please try again.
        </div>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Empty
          icon={<NoMediaIcon />}
          title="No Albums Found"
          description="Try searching with different keywords"
        />
      </div>
    );
  }

  return (
    <Loading isLoading={isFetching && albums.length === 0}>
      <div className="w-full pt-20">
        <Row gutter={[24, 12]}>
          {albums.map((album: Album) => (
            <Col key={album.id} xs={24} sm={12} md={8} lg={8} xl={6}>
              <AlbumCard
                album={album}
                currentUserId={tokenPayload.id}
                isMyAlbum={false}
              />
            </Col>
          ))}
        </Row>
        {hasNextPage && (
          <div ref={ref} className="h-10 flex items-center justify-center mt-8">
            {isFetchingNextPage && (
              <div className="text-gray-500">Loading more albums...</div>
            )}
          </div>
        )}
      </div>
    </Loading>
  );
};

export default AlbumSearchList;

