import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import IconNotification from "../../assets/img/PinCap/icon_notification.svg";
import "./index.less";
import Loading from "../loading/index.tsx";

const useComponentVisible = (initialIsVisible: boolean) => {
  const ref = useRef<any>(null);
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);

  const handleHideDropdown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsComponentVisible(false);
    }
  };

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible, handleClickOutside };
};

const Notification = () => {
  const { ref, isComponentVisible, setIsComponentVisible, handleClickOutside } =
    useComponentVisible(false);

  const [data, setData] = useState<any>({
    total: 0,
    items: [],
    hasMore: true,
    pageIndex: 1,
    pageSize: 10,
  });

  const onShowDropdown = () => {
    console.log("test")
    setIsComponentVisible(!isComponentVisible);
  };

  const fetchMoreData = async () => {
    // if (data.items.length >= data.total) {
    //   setData({
    //     ...data,
    //     hasMore: false
    //   })
    //   return;
    // }
    // const { items, unReadedCount } = await fetchMyNotifications({ pageSize: data.pageSize, pageIndex: data.pageIndex + 1 });
    // setData({
    //   ...data,
    //   total: unReadedCount,
    //   items: data.items.concat(items),
    //   pageIndex: data.pageIndex + 1,
    // })
  };
  return (
    <div className="menu-notification" onClick={onShowDropdown}>
      <div className="numbers-notification">
        {20}
      </div>
      <img width="26" src={IconNotification} alt="notification" />

      {isComponentVisible && (
        <>
          <div id="scrollableDiv" className="list-notification" ref={ref}>
            {false ? (
              <p className="error-title-notification">
                "Error"
              </p>
            ) : (
              <InfiniteScroll
                // dataLength={data.items.length}
                dataLength={20}
                next={fetchMoreData}
                hasMore={data.hasMore}
                loader={
                  <div className="loading-notification">
                    <Loading />
                  </div>
                }
                scrollableTarget="scrollableDiv"
              >
                {data.items.length === 0 ? (
                  " "
                ) : (
                  <div className="container-mark">
                    {/* <span onClick={handleMarkAsRead}>
                      {i18n.t("MarkAllAsRead")}
                    </span> */}
                  </div>
                )}

                {/* {data.items.map((item: any, index: any) => ( */}
                  <div
                    className={[
                      "item-notification",
                      // item.isReaded ? "mark-read" : "",
                      false ? "mark-read" : "",
                    ].join(" ")}
                    // onClick={() =>
                    //   onClickItem(
                    //     item.id,
                    //     item.metadata.campaignMetadata.campaignId
                    //   )
                    // }
                    // key={index}
                  >
                    {/* <img
                      src={
                        item.type === "CampaignApplyForInvitationAccepted" ||
                        item.type === "CampaignApplyForInvitation"
                          ? AddCircle
                          : AddCircleRed
                      }
                      alt="add"
                      className="left-item-notification"
                    /> */}
                    <div className="right-item-notification">
                      <p className="title-notification">
                        Tiêu đề
                      </p>
                      <p className="sub-title-notification">
                        Content
                      </p>
                      <p className="munites-ago">
                        10 giờ trước
                      </p>
                    </div>
                  </div>
                {/* ))} */}
              </InfiniteScroll>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notification;
