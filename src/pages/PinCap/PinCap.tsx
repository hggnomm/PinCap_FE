import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./index.less";
import { Layout } from "antd";
import PinMedia from "./PinMedia/Pin";
import { getAllMedias } from "../../api/media";

const PinCap = () => {
  const [listMedia, setListMedia] = useState<any>([]);

  useEffect(() => {
    return() => {
      getListMedias()
    }
  }, []);

  const getListMedias = async () => {
    try {
      const data = await getAllMedias();
      if (data?.listMedia) {
        setListMedia(data?.listMedia.data);
      }
    } catch (error) {
      console.log("Lỗi khi lấy list media, " + error)
    }
  };
  return (
    <div className="pincap-container">
      {listMedia?.map((media: any, index: any) => (
        <PinMedia key={index} srcUrl={media?.mediaURL} data={media}></PinMedia>
      ))}
    </div>
  );
};

export default PinCap;
