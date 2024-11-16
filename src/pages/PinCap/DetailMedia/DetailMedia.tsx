import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailMedia } from "../../../api/media"; // Assuming you have this API function to fetch album data
import { DownOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import black_heart from "../../../assets/img/PinCap/black-heart.png";
import download from "../../../assets/img/PinCap/download.png";
import more from "../../../assets/img/PinCap/more.png";
import { Dropdown, Menu } from "antd"; // Import Menu from Ant Design

import "./index.less";
import { getAlbumData } from "../../../api/album";

const DetailMedia = () => {
  const [media, setMedia] = useState<Media | null>(null);
  const [albumData, setAlbumData] = useState<Album[]>([]); // Store album data
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchMediaDetail = async (idMedia: string) => {
      const detail = await getDetailMedia(idMedia);
      if (detail) {
        setMedia(detail);
      }
    };

    if (id) {
      fetchMediaDetail(id);
    }
  }, [id]);

  const fetchAlbumData = async () => {
    const response = await getAlbumData();
    if (response && response.data) {
      setAlbumData(response.data);
    }
  };

  if (!media) {
    return <div>Loading...</div>;
  }

  const albumMenu = (
    <div className="menu-album">
      <div className="top-menu-album">
        <span>Album</span>
      </div>
      <Menu className="list-album">
        {albumData.map((album) => (
          <Menu.Item className="item-album" key={album.id}>
            <div className="album-info">
              <img src={album.image_cover} alt={album.album_name} />
              <span>{album.album_name}</span>
            </div>
            <button className="save-button">Save</button>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );

  return (
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
          {media.type === "IMAGE" ? (
            <img src={media.media_url} alt={media.media_name} />
          ) : (
            <video src={media.media_url} controls />
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
                  <img src={black_heart} alt="heart" />
                </button>
                <span>{media.reaction_user_count}</span>
              </div>

              <button>
                <img src={download} alt="download" />
              </button>
              <button>
                <img src={more} alt="more" />
              </button>
            </div>
            <div className="action-right">
              <Dropdown
                overlay={albumMenu} // Pass the dynamically fetched album data to the dropdown
                placement="bottom"
                trigger={["click"]}
                onVisibleChange={fetchAlbumData} // Fetch album data when the dropdown is clicked
                className="dropdown_item"
              >
                <button className="album">
                  Album
                  <DownOutlined
                    style={{ marginLeft: "10px", fontWeight: "600" }}
                  />
                </button>
              </Dropdown>

              <button className="save">Save</button>
            </div>
          </div>
          <div className="comment">
            <div className="user_owner">
              <div className="user">
                <img src={media.ownerUser.avatar} alt="owner" />
                <div className="info">
                  <span style={{ fontWeight: "bold" }}>
                    {media.ownerUser.first_name}
                  </span>
                  <span>{media.numberUserFollowers} follower</span>
                </div>
              </div>
              <button className="follow">Follow</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailMedia;
