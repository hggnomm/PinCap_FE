import React, { useEffect, useMemo, useCallback, useRef } from "react";

import { useInView } from "react-intersection-observer";

import { useInfiniteQuery } from "@tanstack/react-query";
import { clsx } from "clsx";

// eslint-disable-next-line import/no-unresolved, import/order
import Masonry from "react-masonry-css";

import "./ViewPinComponent.less";

import { motion } from "framer-motion";

import Empty, { NoMediaIcon } from "@/components/Empty";
import Loading from "@/components/Loading/Loading";
import { EMPTY_PAGINATION_RESPONSE } from "@/constants";
import PinMedia from "@/pages/PinCap/PinMedia/PinMedia";
import { PaginatedMediaResponse } from "@/types/Media/MediaResponse";

import { Media } from "type";

const breakpointColumnsObj = {
  default: 6,
  1536: 5,
  1280: 4,
  1024: 3,
  768: 2,
};

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
  refetchOnMount?: boolean | "always";
  staleTime?: number;
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
  refetchOnMount,
  staleTime,
}) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px", // Trigger fetch when element is 200px away from viewport
  });

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
        ...EMPTY_PAGINATION_RESPONSE,
        data: [],
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
    refetchOnMount: refetchOnMount,
    staleTime: staleTime,
  });

  const lastFetchTimeRef = useRef<number>(0);
  const scrollCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      const now = Date.now();
      // Throttle: Only fetch if last fetch was more than 500ms ago
      if (now - lastFetchTimeRef.current > 500) {
        lastFetchTimeRef.current = now;
        fetchNextPage();
      }
    }
  }, [fetchNextPage, inView, hasNextPage, isFetchingNextPage]);

  // Additional scroll check for fast scrolling
  useEffect(() => {
    if (propMedias || !hasNextPage) return;

    const checkScrollPosition = () => {
      if (isFetchingNextPage) return;

      const sentinelElement = sentinelRef.current;
      if (!sentinelElement) return;

      const rect = sentinelElement.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // If sentinel is within 500px of viewport, trigger fetch
      if (rect.top <= windowHeight + 500 && hasNextPage) {
        const now = Date.now();
        if (now - lastFetchTimeRef.current > 500) {
          lastFetchTimeRef.current = now;
          fetchNextPage();
        }
      }
    };

    // Check on scroll with throttling
    let scrollTimeout: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        checkScrollPosition();
        scrollTimeout = null;
      }, 100);
    };

    // Periodic check for fast scrolling
    scrollCheckIntervalRef.current = setInterval(checkScrollPosition, 500);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (scrollCheckIntervalRef.current) {
        clearInterval(scrollCheckIntervalRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, propMedias]);

  const medias = useMemo(() => {
    if (propMedias) {
      return propMedias;
    }
    // Extract data array from each page's response
    return data?.pages.flatMap((page) => page.data) || [];
  }, [propMedias, data]);

  // Optimize: Memoize reloadData function để tránh re-create mỗi lần render
  const reloadData = useCallback(() => {
    if (propMedias) return;
    refetch();
  }, [propMedias, refetch]);

  const isEmpty = (status === "success" || !!propMedias) && medias.length === 0;

  let content;
  if (!isEmpty && (status === "success" || propMedias)) {
    content = medias.map((media: Media, index: number) => {
      const isLastItem = medias.length === index + 1 && !propMedias;

      return (
        <PinMedia
          innerRef={isLastItem ? ref : undefined}
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
          mediaFromAlbum={media}
          onDelete={reloadData}
        />
      );
    });
  }

  const contentWrapper = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        "w-full max-w-full px-3 box-border overflow-x-hidden",
        "select-none touch-callout-none"
      )}
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
            className="flex -ml-2 w-auto"
            columnClassName="pl-2 bg-clip-padding"
          >
            {content}
          </Masonry>
          {!propMedias && (
            <div
              ref={(node) => {
                sentinelRef.current = node;
                if (typeof ref === "function") {
                  ref(node);
                }
              }}
              className="h-2.5"
            />
          )}
        </>
      )}
    </motion.div>
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
