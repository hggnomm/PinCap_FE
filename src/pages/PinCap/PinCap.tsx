import React, { useEffect, useState } from "react";
import "./index.less";
import PinMedia from "./PinMedia/Pin";
import { getAllMedias } from "../../api/media";
import Loading from "../../components/Loading/Loading";

const PinCap = () => {
  const [listMedia, setListMedia] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Thêm state lỗi
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Thêm state thông báo thành công

  useEffect(() => {
    getListMedias(page);

    // Lắng nghe sự kiện scroll
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

  const getListMedias = async (currentPage: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null); 
    try {
      const data = await getAllMedias(currentPage);
      if (data?.data.length) {
        setListMedia((prevList) => [...prevList, ...data.data]);
        setSuccessMessage("Dữ liệu đã được tải thành công!");
      } else {
        setHasMore(false); 
      }
    } catch (error) {
      setError("Lỗi khi lấy list media: " + error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Tăng page lên 1
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
