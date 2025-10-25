import { useEffect } from "react";

import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router";

import { useInfiniteQuery } from "@tanstack/react-query";

import { FilterOutlined, PlusOutlined } from "@ant-design/icons/lib";

import { getMyMedias } from "@/api/media";
import ButtonCircle from "@/components/buttonCircle/ButtonCircle";
import Loading from "@/components/loading/Loading";
import MediaList from "@/components/viewPin/ViewPinComponent";
import { ROUTES } from "@/constants/routes";

import "./MyMedia.less";

const MyMedia = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  window.scrollTo(0, 0);

  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["medias", "my-media", "created"],
    queryFn: ({ pageParam }) => getMyMedias({ pageParam, is_created: true }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = lastPage.length ? allPages.length + 1 : undefined;
      return nextPage;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  const medias = data?.pages.flat() || [];

  return (
    <Loading isLoading={isFetching || isFetchingNextPage}>
      <div className="media-container">
        <div className="fixed-topbar !sticky top-0 !z-20 bg-white !pb-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <div className="text-head">
            <span>All Medias</span>
          </div>
          <ButtonCircle
            paddingClass="padding-0-8"
            icon={
              <FilterOutlined
                style={{
                  fontSize: "26px",
                  strokeWidth: "30",
                  stroke: "black",
                }}
              />
            }
          />
          <ButtonCircle
            text="Create"
            paddingClass="padding-0-8"
            icon={
              <PlusOutlined
                style={{
                  fontSize: "26px",
                  strokeWidth: "40",
                  stroke: "black",
                }}
              />
            }
            dropdownMenu={[
              {
                key: "1",
                title: "Media",
                onClick: () => {
                  navigate(ROUTES.CREATE_MEDIA);
                },
              },
            ]}
          />
        </div>
        <div className="my-list-media">
          <div className="action"></div>
          <div className="list">
            {status === "success" && (
              <MediaList medias={medias} isEditMedia withoutLoadingWrapper />
            )}
            <div ref={ref} style={{ height: 10 }} />
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default MyMedia;
