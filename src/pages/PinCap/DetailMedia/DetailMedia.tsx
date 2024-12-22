import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailMedia, mediaReactions } from "../../../api/media";
import { DownOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import download from "../../../assets/img/PinCap/download.png";
import more from "../../../assets/img/PinCap/more.png";
import { Dropdown, Input, Menu } from "antd";
import Loading from "../../../components/loading/Loading";

import "./index.less";
import { getAlbumData } from "../../../api/album";
import { unidecode } from "unidecode"; // Import thư viện unidecode
import { AddRelationships, DeleteRelationships } from "../../../api/users";
import { Album, Media } from "../../../types/type";
import { FeelingType, getImageReactionWithId } from "../../../utils/utils";

const DetailMedia = () => {
  const [media, setMedia] = useState<Media | null>(null);
  const [albumData, setAlbumData] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchMediaDetail = async (idMedia: string) => {
    setLoading(true);
    setError(null);
    try {
      const detail = await getDetailMedia(idMedia);
      if (detail) {
        setMedia(detail);
      }
    } catch (error) {
      setError("Lỗi khi lấy chi tiết media: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    const normalizedSearchTerm = unidecode(value.toLowerCase()); 

    const filteredAlbums = albumData.filter(
      (album) =>
        unidecode(album.album_name.toLowerCase()).includes(normalizedSearchTerm) 
    );
    setAlbumData(filteredAlbums); 
  };

  const handleWithOwnerUser = async () => {
    const request = "FOLLOWING";

    try {
      if (media?.ownerUser?.isFollowing) {
        await DeleteRelationships({
          followeeId: media?.ownerUser.id,
          status: request,
        });

        setMedia((prevState) => {
          if (!prevState) return null;
          return {
            ...prevState,
            ownerUser: {
              ...prevState.ownerUser,
              isFollowing: false,
            },
          };
        });

        return;
      }

      const response = await AddRelationships({
        followeeId: media?.ownerUser.id,
        status: request,
      });

      if (response) {
        setMedia((prevState) => {
          if (!prevState) return null;
          return {
            ...prevState,
            ownerUser: {
              ...prevState.ownerUser,
              isFollowing: true, 
            },
          };
        });
      }
    } catch (error) {
      console.error(error);
      setError("Error when following or unfollowing a media!");
    }
  };

  const handleReaction = async () => {
    try {
      let feelingId = FeelingType.HEART; // Hiện tại chỉ có một icon
      let newReactionCount: number;

      // Tính toán số lượng phản ứng
      if (media?.reaction?.feeling_id === feelingId) {
        newReactionCount = (media.reaction_user_count || 0) - 1;
      } else {
        newReactionCount = (media?.reaction_user_count || 0) + 1;
      }

      // Gọi API để cập nhật phản ứng
      const response = await mediaReactions({
        mediaId: id,
        feelingId: feelingId,
      });

      if (response) {
        setMedia((prevState) => {
          if (!prevState) return null;

          return {
            ...prevState,
            reaction_user_count: Math.max(0, newReactionCount), // Đảm bảo không âm
            reaction: {
              ...prevState.reaction,
              feeling_id:
                prevState.reaction?.feeling_id === feelingId ? null : feelingId, // Cập nhật trạng thái react
              id: prevState.reaction?.id || "", // Đảm bảo reaction.id luôn là string
            },
          };
        });
      }
    } catch (error) {
      setError("Error when reacting to a media!");
    }
  };

  const albumMenu = (
    <div className="menu-album">
      <div className="top-menu-album">
        <span>Album</span>
      </div>
      <Input
        placeholder="Search album..."
        allowClear
        onSearch={handleSearch} // Khi nhấn Enter
        onChange={(e) => handleSearch(e.target.value)} // Khi gõ trực tiếp
        className="search-album"
        value={searchTerm} // Đồng bộ hóa giá trị tìm kiếm
      />
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
    <Loading isLoading={loading} error={error}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.5 }}
        className="detail-media-container"
      >
        <div className="detail-media">
          <div className="left-view">
            {media ? (
              media.type === "IMAGE" ? (
                <img src={media.media_url} alt={media.media_name} />
              ) : (
                <video src={media.media_url} controls />
              )
            ) : (
              <p>Loading media...</p>
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
                  <button onClick={() => handleReaction()}>
                    <img
                      src={getImageReactionWithId(media?.reaction?.feeling_id)}
                      alt="heart"
                    />
                  </button>
                  <span>{media?.reaction_user_count}</span>
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
            <div className="description">
              <span>test</span>
            </div>
            <div className="user_owner">
              <div className="user">
                {media?.ownerUser && (
                  <>
                    <img src={media.ownerUser.avatar} alt="owner" />
                    <div className="info">
                      <span style={{ fontWeight: "bold" }}>
                        {media.ownerUser.first_name}
                      </span>
                      <span>{media.numberUserFollowers} follower</span>
                    </div>
                  </>
                )}
              </div>
              {media?.ownerUser?.isFollowing ? (
                <button onClick={handleWithOwnerUser} className="following">
                  Following
                </button>
              ) : (
                <button onClick={handleWithOwnerUser} className="follow ">
                  Follow
                </button>
              )}
            </div>
            <div className="comment"></div>
          </div>
        </div>
      </motion.div>
    </Loading>
  );
};

export default DetailMedia;
