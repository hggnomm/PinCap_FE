import React, { useEffect, useState } from "react";
import "./index.less";
import PinMedia from "./PinMedia/Pin";
import { getAllMedias } from "../../api/media";

const demo_media = [
  { media_url: "https://i.pinimg.com/736x/85/35/48/853548d3d29162e4a6f98e30b79e8e62.jpg" },
  { media_url: "https://i.pinimg.com/736x/50/82/c4/5082c41029902d4999a3603f0b5122ab.jpg" },
  { media_url: "https://i.pinimg.com/736x/f4/cc/a7/f4cca7d75545ce21fe97e50ff843ce67.jpg" },
  { media_url: "https://i.pinimg.com/736x/02/2f/07/022f07f3092e703de5ee96240fd5b1c9.jpg" },
  { media_url: "https://i.pinimg.com/736x/5c/3a/75/5c3a75a52728f86ef44a06c842a799ac.jpg" },
];
const PinCap = () => {
  const [listMedia, setListMedia] = useState<any>([]);

  useEffect(() => {
    return () => {
      getListMedias();
    };
  }, []);

  const getListMedias = async () => {
    try {
      const data = await getAllMedias();
      console.log(data);
      if (data) {
        setListMedia(data?.data);
      }
    } catch (error) {
      console.log("Lỗi khi lấy list media, " + error);
    }
  };
  return (
    <div className="pincap-container">
      {listMedia?.map((media: any, index: any) => (
        <PinMedia key={index} srcUrl={media?.media_url} data={media}></PinMedia>
      ))}
    </div>
  );
};

export default PinCap;
