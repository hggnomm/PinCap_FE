import React, { useEffect, useRef, useState } from "react";
import { getMyMedias } from "../../../api/media";
import Loading from "../../../components/loading/Loading";
import { Divider } from "antd/es";

interface DraftMediaProps {
  resetFormAndCloseDrawer: () => void;
}

const DraftMedia = ({ resetFormAndCloseDrawer }: DraftMediaProps) => {
  const [listMedia, setListMedia] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelectedMedia, setIsSelectedMedia] = useState<any | null>(null);

  const isFetching = useRef(false);

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

  const fetchData = async () => {
    if (isFetching.current || !hasMore) return;

    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await getMyMedias(page, 1);
      if (data?.data.length) {
        setListMedia((prevList) => [...prevList, ...data.data]);
        console.log(data?.data);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError("Error when getting media list: " + error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const handleMediaClick = (media: any) => {
    setIsSelectedMedia(media);
    console.log("Selected Media:", media);
  };

  return (
    <Loading isLoading={loading} error={error}>
      <div className="draft-container">
        <button className="create-media-btn" onClick={resetFormAndCloseDrawer}>
          <span className="text-container">Create new</span>
        </button>
        <Divider />

        <div className="media-list">
          {listMedia.map((media) => (
            <div
              key={media.id}
              className={`media-item ${
                isSelectedMedia?.id === media.id ? "selected" : ""
              }`}
              onClick={() => handleMediaClick(media)}
            >
              <div className="media-thumbnail">
                <img
                  src={media.media_url || "default-image-url"}
                  alt={media.media_name || "Media Item"}
                  className="thumbnail-image"
                />
              </div>
              <div className="media-name">{media.media_name}</div>
            </div>
          ))}
        </div>
      </div>
    </Loading>
  );
};

export default DraftMedia;