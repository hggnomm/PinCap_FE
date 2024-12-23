import React, { useEffect, useState, useRef } from "react";
import "./ViewPinComponent.less";
import PinMedia from "../../pages/PinCap/PinMedia/PinMedia";
import Loading from "../../components/loading/Loading";
import { motion, AnimatePresence } from "framer-motion";

const MediaList = ({ apiCall, extraParams, medias }: any) => {
  const [listMedia, setListMedia] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isFetching = useRef(false);

  const fetchData = async () => {
    // Chỉ gọi API nếu medias không có giá trị
    if (medias) {
      setListMedia(medias);
      return;
    }

    // Nếu chưa có medias, tiếp tục gọi API
    if (isFetching.current || !hasMore) return;

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(page, extraParams);
      if (data?.data.length) {
        setListMedia((prevList) => [...prevList, ...data.data]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError("Lỗi khi lấy list media: " + error);
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
            {listMedia.map((media: any) => (
              <PinMedia
                key={media?.id}
                srcUrl={media?.media_url}
                data={media}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Loading>
  );
};

export default MediaList;
