import React, { useEffect, useMemo, useCallback } from "react";

import { useInView } from "react-intersection-observer";

import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

// eslint-disable-next-line import/no-unresolved, import/order
import Masonry from "react-masonry-css";

import "./ViewPinComponent.less";

import Empty, { NoMediaIcon } from "@/components/Empty";
import Loading from "@/components/loading/Loading";
import PinMedia from "@/pages/PinCap/PinMedia/PinMedia";
import { PaginatedMediaResponse } from "@/types/Media/MediaResponse";

import { Media } from "type";

/**
 * MediaList Component - Hiển thị danh sách media với infinite scroll
 *
 * Cách sử dụng:
 * 1. Với API call (khuyến nghị):
 *    <MediaList
 *      queryKey={["medias", "all"]}
 *      queryFn={(pageParam) => getAllMedias({ pageParam })}
 *      isEditMedia={false}
 *    />
 *
 * 2. Với data có sẵn:
 *    <MediaList
 *      medias={myMediaData}
 *      isEditMedia={true}
 *    />
 *
 * Ví dụ cụ thể:
 * - Trong PinCap.tsx: Hiển thị tất cả media
 * - Trong MyMedia.tsx: Hiển thị media của user với infinite scroll
 * - Trong DetailAlbum.tsx: Hiển thị media trong album (data có sẵn)
 *
 * Props:
 * - queryKey: Array chứa key cho React Query cache
 * - queryFn: Function để fetch data (nhận pageParam và trả về Promise<PaginatedMediaResponse<Media>>)
 * - medias: Array media có sẵn (optional, nếu có thì không dùng queryFn)
 * - isEditMedia: Boolean cho phép edit media
 * - enabled: Boolean để enable/disable query (default: true)
 */

// Animation variants - extract ra ngoài để tránh tạo mới mỗi lần render
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

interface MediaListProps {
  queryKey?: string[];
  queryFn?: (pageParam: number) => Promise<PaginatedMediaResponse<Media>>;
  medias?: Media[];
  isEditMedia?: boolean;
  isSaveMedia?: boolean;
  albumContext?: { inAlbum: boolean; albumId?: string; onRemoved?: () => void };
  enabled?: boolean;
  withoutLoadingWrapper?: boolean;
}

const MediaList: React.FC<MediaListProps> = ({
  queryKey,
  queryFn,
  medias: propMedias,
  isEditMedia = false,
  isSaveMedia = true,
  albumContext,
  enabled = true,
  withoutLoadingWrapper = false,
}) => {
  const { ref, inView } = useInView();

  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKey || [],
    queryFn: ({ pageParam }) =>
      queryFn?.(pageParam) ||
      Promise.resolve({
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Use pagination metadata from API response
      if (lastPage.current_page < lastPage.last_page) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
    enabled: !propMedias && enabled && !!queryKey && !!queryFn,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  // Optimize: Dùng useMemo thay vì useState + useEffect
  const medias = useMemo(() => {
    if (propMedias) {
      return propMedias;
    }
    // Extract data array from each page's response
    return data?.pages.flatMap((page) => page.data) || [];
  }, [propMedias, data]);

  // Optimize: Memoize reloadData function để tránh re-create mỗi lần render
  const reloadData = useCallback(() => {
    if (propMedias) {
      return;
    }
    refetch();
  }, [propMedias, refetch]);

  let content;
  const isEmpty = (status === "success" || !!propMedias) && medias.length === 0;

  if (!isEmpty && (status === "success" || propMedias)) {
    content = medias.map((media: Media, index: number) => {
      if (medias.length === index + 1 && !propMedias) {
        return (
          <PinMedia
            innerRef={ref}
            key={media.id}
            srcUrl={media.media_url}
            data={{
              id: media.id,
              media_name: media.media_name,
              media_url: media.media_url,
              type: media.type || "",
            }}
            isEditMedia={isEditMedia}
            isSaveMedia={isSaveMedia}
            albumContext={albumContext}
            onDelete={reloadData}
          />
        );
      }

      return (
        <PinMedia
          key={media.id}
          srcUrl={media.media_url}
          data={{
            id: media.id,
            media_name: media.media_name,
            media_url: media.media_url,
            type: media.type || "",
          }}
          isEditMedia={isEditMedia}
          isSaveMedia={isSaveMedia}
          albumContext={albumContext}
          onDelete={reloadData}
        />
      );
    });
  }

  const breakpointColumnsObj = {
    default: 6,
    1200: 4,
    768: 3,
    480: 3,
  };

  const contentWrapper = (
    <div className="pincap-container">
      <motion.div
        className="media-list-wrapper"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {isEmpty && (
          <Empty
            icon={<NoMediaIcon />}
            title="No Media Yet"
            description="There aren't any medias."
          />
        )}
        {!isEmpty && (
          <>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="masonry-grid"
              columnClassName="masonry-grid-column"
            >
              {content}
            </Masonry>
            {!propMedias && <div ref={ref} style={{ height: 10 }} />}
          </>
        )}
      </motion.div>
    </div>
  );

  if (withoutLoadingWrapper) {
    return contentWrapper;
  }

  return (
    <Loading isLoading={isFetching || isFetchingNextPage}>
      {contentWrapper}
    </Loading>
  );
};

export default MediaList;
