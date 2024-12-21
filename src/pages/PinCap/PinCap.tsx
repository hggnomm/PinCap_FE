import React, { useEffect, useState, useRef } from "react";
import "./index.less";
import PinMedia from "./PinMedia/PinMedia";
import { getAllMedias } from "../../api/media";
import Loading from "../../components/loading/Loading";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence and motion
import { toast } from "react-toastify";

const PinCap = () => {
  const [listMedia, setListMedia] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isFetching = useRef(false);

  const fetchData = async () => {
    if (isFetching.current || !hasMore) return; // Kiểm tra nếu đang fetching hoặc không có dữ liệu mới

    isFetching.current = true; // Đặt trạng thái fetching thành true
    setLoading(true);
    setError(null);

    try {
      const data = await getAllMedias(page);
      if (data?.data.length) {
        setListMedia((prevList) => [...prevList, ...data.data]);
      } else {
        setHasMore(false); // Nếu không có thêm dữ liệu, ngừng gọi API
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

    // scroll
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
          className="pin-media-list"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }, // Stagger transition for children
          }}
        >
          <AnimatePresence>
            {listMedia?.map((media: any, index: any) => (
              <PinMedia key={media?.id} srcUrl={media?.media_url} data={media} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Loading>
  );
};

export default PinCap;
