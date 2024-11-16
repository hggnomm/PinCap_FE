import React, { useEffect, useState } from "react";
import "./index.less";
import { useParams } from "react-router-dom";
import { getDetailMedia } from "../../../api/media";
import { Col, Row } from "antd";
import black_heart from "../../../assets/img/PinCap/black-heart.png";
import heart from "../../../assets/img/PinCap/heart.png";
import more from "../../../assets/img/PinCap/more.png";
import download from "../../../assets/img/PinCap/download.png";
import {
  DownloadOutlined,
  DownOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const demo_detail_media = {
  id: "9bf85bd0-fe9f-4220-8842-43965d31e2f1",
  is_comment: false,
  is_created: true,
  media_name: "Songoku",
  media_url:
    "https://i.pinimg.com/736x/85/35/48/853548d3d29162e4a6f98e30b79e8e62.jpg",
  numberUserFollowers: 6969,
  ownerUser: {
    id: "9bd27d1e-ee34-4246-9239-625f2fdfa817",
    first_name: "tan",
    last_name: "nat",
    email: "leduytan177@gmail.com",
    avatar:
      "https://i.pinimg.com/736x/17/82/08/17820871f8d3369d1579b2840697a13a.jpg",
    privacy: "PUBLIC",
  },
  reaction_user_count: 15,
  type: "IMAGE",
  userComments: null,
};

const DetailMedia = () => {
  const [media, setMedia] = useState({});
  const { id } = useParams();

  useEffect(() => {
    detailMedia(id);
  }, []);

  const detailMedia = async (idMedia) => {
    const detailMedia = await getDetailMedia(idMedia);
    if (detailMedia) {
      setMedia(detailMedia);
    }
  };

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 1 }}
        className="detail-media-container"
      >
        <div className="detail-media">
          <div className="left-view">
            {demo_detail_media.type == "IMAGE" ? (
              <img src={demo_detail_media.media_url} alt="" />
            ) : (
              <video src=""></video>
            )}
          </div>
          <div className="right-view">
            <div className="action">
              <div className="action-left">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button>
                    <img src={black_heart} alt="" />
                  </button>
                  <span>{demo_detail_media.reaction_user_count}</span>
                </div>

                <button>
                  <img src={download} alt="" />
                </button>
                <button>
                  <img src={more} alt="" />
                </button>
              </div>
              <div className="action-right">
                <button className="album">
                  Album
                  <DownOutlined
                    style={{ marginLeft: "10px", fontWeight: "600" }}
                  />
                </button>
                <button className="save">Save</button>
              </div>
            </div>
            <div className="comment">
              <div className="user_owner">
                <div className="user">
                  <img src={demo_detail_media.ownerUser.avatar} alt="" />
                  <div className="info">
                    <span style={{ fontWeight: "bold" }}>
                      {demo_detail_media.ownerUser.first_name}
                    </span>
                    <span>{demo_detail_media.numberUserFollowers}</span>
                  </div>
                </div>
                <button className="follow">Follow</button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default DetailMedia;
