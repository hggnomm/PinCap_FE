import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./index.less";
import { Layout } from "antd";
import HeaderCommon from "../../components/header/HeaderCommon";
import SiderCommon from "../../components/sider/SiderCommon";
import PinMedia from "./PinMedia/Pin";
import { getMedia } from "../../api/media";

const PinCap = () => {
  const [listMedia, setListMedia] = useState([]);
  const [pageMedia, setPageMedia] = useState(1);
  useEffect(() => {
    getMedia(pageMedia).then((data) => {
      setListMedia(data.listMedia.data);
    });
  }, []);

  return (
    <div className="pincap-container">
      {listMedia.map((media, index) => (
        <PinMedia key={index} srcUrl={media.mediaURL} data={media}></PinMedia>
      ))}


      {/* <PinMedia
        srcUrl={
          "https://i.pinimg.com/originals/d6/d6/95/d6d6950373cf0ae833d8f1fd4563a8cf.jpg"
        }
      ></PinMedia>
      <PinMedia
        srcUrl={
          "https://i.pinimg.com/originals/c9/3a/8b/c93a8be6fd6618c03d82ad0b4c8a9fd1.jpg"
        }
      ></PinMedia>
      <PinMedia
        srcUrl={
          "https://i.pinimg.com/originals/fb/cc/43/fbcc43003276a217c2c80b241342f53c.jpg"
        }
      ></PinMedia>
      <PinMedia
        srcUrl={
          "https://i.pinimg.com/originals/da/dc/e6/dadce6700f5a09256c158a390fb60fb9.jpg"
        }
      ></PinMedia>
      <PinMedia
        srcUrl={
          "https://i.pinimg.com/originals/77/76/72/77767259b29984ed278fdbfa5fb01b7a.jpg"
        }
      ></PinMedia>
      <PinMedia
        srcUrl={
          "https://i.pinimg.com/originals/f6/98/2f/f6982f0e1a589452390c0c7fe7f77c11.jpg"
        }
      ></PinMedia>
      <PinMedia
        srcUrl={
          "https://i.pinimg.com/originals/95/d4/67/95d467a8e77282ebd7e32c469b4ad063.jpg"
        }
      ></PinMedia>
      <PinMedia
        srcUrl={
          "https://i.pinimg.com/originals/4c/f9/b0/4cf9b0bcb7e46ec01250e39d77df9c04.jpg"
        }
      ></PinMedia>
      <PinMedia
        srcUrl={
          "https://i.pinimg.com/originals/38/53/cb/3853cbd88c6f3d9136344dbabfad1b7f.jpg"
        }
      ></PinMedia> */}
    </div>
  );
};

export default PinCap;
