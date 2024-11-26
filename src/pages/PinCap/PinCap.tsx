import React, { useEffect, useState } from "react";
import "./index.less";
import PinMedia from "./PinMedia/Pin";
import { getAllMedias } from "../../api/media";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

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
  }, [page]); // Đảm bảo re-render khi `page` thay đổi

  const getListMedias = async (currentPage: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null); // Reset lỗi mỗi lần gọi API
    try {
      const data = await getAllMedias(currentPage);
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
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // Tăng page lên 1
    }
  };

  return (
    <LoadingSpinner
      isLoading={loading}
      error={error}
      isOpenSuccess={!!successMessage} // Mở thông báo thành công khi có successMessage
      successMessage={successMessage}
    >
      <div className="pincap-container">
        {listMedia?.map((media: any, index: any) => (
          <PinMedia key={index} srcUrl={media?.media_url} data={media} />
        ))}
        {loading && <p>Đang tải...</p>}
      </div>
    </LoadingSpinner>
  );
};

export default PinCap;
