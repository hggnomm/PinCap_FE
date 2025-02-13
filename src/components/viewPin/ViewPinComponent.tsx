import React, { useEffect, useState, useRef } from "react";
import "./ViewPinComponent.less";
import PinMedia from "../../pages/PinCap/PinMedia/PinMedia";
import Loading from "../../components/loading/Loading";
import { motion, AnimatePresence } from "framer-motion";
import { Media } from "type";

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
  const [listMedia, setListMedia] = useState<Media[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isFetching = useRef<boolean>(false);

  const fetchData = async () => {
    // If medias are provided, directly set the media list and skip API call
    if (medias) {
      setListMedia(medias);
      return;
    }

    if (isFetching.current || !hasMore) return;

    if (!apiCall) {
      setError("API call function is not provided.");
      return;
    }

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(page, extraParams);
      if (data?.data?.length) {
        setListMedia((prevList) => [...prevList, ...data.data]);
      } else {
        setHasMore(false);
      }
    } catch (error: any) {
      setError("Error fetching media list: " + error?.message || error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchData();

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Loading isLoading={loading} error={error}>
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
            {listMedia.map((media) => (
              <PinMedia
                key={media.id}
                srcUrl={media.media_url}
                data={media}
                isEditMedia={isEditMedia}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Loading>
  );
};

export default MediaList;
