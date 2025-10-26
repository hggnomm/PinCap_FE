import React, { useEffect, useMemo, useCallback } from "react";

import "./ViewPinComponent.less";
import { useInView } from "react-intersection-observer";

import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import Loading from "@/components/loading/Loading";
import PinMedia from "@/pages/PinCap/PinMedia/PinMedia";

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
 * - queryFn: Function để fetch data (nhận pageParam và trả về Promise<Media[]>)
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
  queryFn?: (pageParam: number) => Promise<Media[]>;
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
    queryFn: ({ pageParam }) => queryFn?.(pageParam) || Promise.resolve([]),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
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
    return data?.pages.flat() || [];
  }, [propMedias, data]);

  // Optimize: Memoize reloadData function để tránh re-create mỗi lần render
  const reloadData = useCallback(() => {
    if (propMedias) {
      return;
    }
    refetch();
  }, [propMedias, refetch]);

  let content;
  if (status === "success" || propMedias) {
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

  const contentWrapper = (
    <div className="pincap-container">
      <motion.div
        className="media-list-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {content}
        {!propMedias && <div ref={ref} style={{ height: 10 }} />}
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
