import React, { useEffect, useState, useRef } from "react";
import "./ViewPinComponent.less";
import PinMedia from "../../pages/PinCap/PinMedia/PinMedia";
import Loading from "../../components/loading/Loading";
import { motion, AnimatePresence } from "framer-motion";
import { Media } from "type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

interface MediaListProps {
  apiCall?: (page: number, extraParams: any) => Promise<any>;
  extraParams?: any;
  medias?: Media[];
  isEditMedia?: boolean;
}

const MediaList: React.FC<MediaListProps> = ({
  apiCall,
  extraParams,
  medias,
  isEditMedia = false,
}) => {
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["medias"],
    queryFn: apiCall,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;

      return nextPage;
    },
  });

  const reloadData = () => {
    // setListMedia([]);
    // fetchData();
  };

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  const content = data?.pages.map((medias) => {
    return medias.map((media: Media, index: number) => {
      if (medias.length === index + 1) {
        return (
          <PinMedia
            innerRef={ref}
            key={media.id}
            srcUrl={media.media_url}
            data={media}
            isEditMedia={isEditMedia}
            onDelete={reloadData}
          />
        );
      }

      return (
        <PinMedia
          key={media.id}
          srcUrl={media.media_url}
          data={media}
          isEditMedia={isEditMedia}
          onDelete={reloadData}
        />
      );
    });
  });

  return (
    <Loading isLoading={isFetchingNextPage} error={error}>
      <div className="pincap-container">
        <motion.div
          className="media-list-container"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          <AnimatePresence>
            {content}
            <div ref={ref} style={{ height: 10 }} />
          </AnimatePresence>
        </motion.div>
      </div>
    </Loading>
  );
};

export default MediaList;
