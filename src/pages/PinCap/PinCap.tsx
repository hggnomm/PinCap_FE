import React, { useEffect, useState, useRef } from "react";
import "./index.less";
import PinMedia from "./PinMedia/PinMedia";
import { getAllMedias } from "../../api/media";
import Loading from "../../components/loading/Loading";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const PinCap = () => {
  const [listMedia, setListMedia] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Dùng useRef để kiểm tra việc API đang được gọi
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
        setSuccessMessage("Dữ liệu đã được tải thành công!");
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
        {listMedia?.map((media: any, index: any) => (
          <PinMedia key={index} srcUrl={media?.media_url} data={media} />
        ))}
      </div>
    </Loading>
  );
};

export default PinCap;
