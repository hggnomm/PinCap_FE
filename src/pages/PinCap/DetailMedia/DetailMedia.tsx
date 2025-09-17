import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  getAllMedias,
  getDetailMedia,
  mediaReactions,
} from "@/api/media";

import { DownOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import download from "@/assets/img/PinCap/download.png";
import more from "@/assets/img/PinCap/more.png";
import { Dropdown, Input, Menu, notification } from "antd";
import Loading from "@/components/loading/Loading";

import "./index.less";
import { addMediasToAlbum, getMyAlbumData } from "@/api/album";
import { followOrBlockUser, unfollowOrUnblockUser } from "@/api/users";
import { Album, Media } from "@/types/type";
import { FeelingType, getImageReactionWithId } from "@/utils/utils";
import Comment from "./Comment/Comment";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";
import BackButton from "@/components/backButton/BackButton";
import MediaList from "@/components/viewPin/ViewPinComponent";
import ListComments from "./ListComments/ListComments";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
interface TokenPayload {
  id: string;
}

const DetailMedia = () => {
  const [media, setMedia] = useState<Media | null>(null);
  const [albumData, setAlbumData] = useState<Album[]>([]);
  const [filteredAlbumData, setFilteredAlbumData] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const id = location.state?.mediaId;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const tokenPayload = useSelector((state: any) => state.auth) as TokenPayload;


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

  const fetchAlbumData = async () => {
    try {
      const response = await getMyAlbumData();
      if (response && response.data) {
        setAlbumData(response.data); // Set all album data
        setFilteredAlbumData(response.data); // Initially show all albums
      }
    } catch (error) {
      setError("Lỗi khi tải album: " + error);
    }
  };

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      fetchMediaDetail(id);
    }
  }, [id]);

  useEffect(() => {
    fetchAlbumData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    const normalizedSearchTerm = value.toLowerCase();

    const filteredAlbums = albumData.filter(
      (album) => album.album_name.toLowerCase().includes(normalizedSearchTerm) //
    );
    setFilteredAlbumData(filteredAlbums);
  };

  const handleWithOwnerUser = async () => {
    const request = "FOLLOWING";

    try {
      if (media?.ownerUser?.isFollowing) {
        if (!media?.ownerUser?.id) {
          setError("User ID not found!");
          return;
        }

        await unfollowOrUnblockUser({
          followeeId: media.ownerUser.id,
          status: request,
        });

        setMedia((prevState) => {
          if (!prevState) return null;
          return {
            ...prevState,
            numberUserFollowers: (media?.numberUserFollowers ?? 0) - 1,
            ownerUser: {
              ...prevState.ownerUser,
              isFollowing: false,
            },
          };
        });

        return;
      }

      if (!media?.ownerUser?.id) {
        setError("User ID not found!");
        return;
      }

      const response = await followOrBlockUser({
        followeeId: media.ownerUser.id,
        status: request,
      });

      if (response) {
        setMedia((prevState) => {
          if (!prevState) return null;
          return {
            ...prevState,
            numberUserFollowers: (media?.numberUserFollowers ?? 0) + 1,
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
        setMedia((prevState): any => {
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

  const handleDownload = () => {
    if (media?.media_url) {
      saveAs(media.media_url, media.media_name || "downloaded-file");
    }
  };

  const [api, contextHolder] = notification.useNotification();

  const handleSaveMediaInAlbum = async (
    albumId: string,
    album_name: string
  ) => {
    try {
      const request = {
        album_id: albumId,
        medias_id: [id],
      };
      const response = await addMediasToAlbum(request);

      if (response.status === 422) {
        api.warning({
          message: `Cannot save media`,
          description:
            response.message ||
            "This media is already associated with this album.",
          placement: "top",
        });
      } else {
        api.success({
          message: "Success",
          description: `Media has been successfully saved to ${album_name}.`,
          placement: "top",
        });
      }
    } catch (error) {
      api.error({
        message: "Error",
        description: `Failed to save media to ${album_name}. Please try again.`,
        placement: "top",
      });
    }
  };

  const albumMenu = (
    <>
      {contextHolder}
      <div className="menu-album">
        <div className="top-menu-album">
          <span>Album</span>
        </div>
        <Input
          placeholder="Search album..."
          allowClear
          onChange={(e) => handleSearch(e.target.value)} // Khi gõ trực tiếp
          className="search-album"
          value={searchTerm} // Đồng bộ hóa giá trị tìm kiếm
        />
        <Menu className="list-album">
          {filteredAlbumData.map((album) => (
            <Menu.Item className="item-album" key={album.id}>
              <div className="album-info">
                <div className="img-album">
                  {album.image_cover && (
                    <img src={album.image_cover} alt={album.album_name} />
                  )}
                </div>
                <span>{album.album_name}</span>
              </div>
              <button
                className="save-button"
                onClick={() =>
                  handleSaveMediaInAlbum(album.id, album.album_name)
                }
              >
                <p>Save</p>
              </button>
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </>
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
          <BackButton />
          <div className="left-view">
            {media &&
              (media.type === "IMAGE" ? (
                <Zoom>
                  <img src={media.media_url} alt={media.media_name} />
                </Zoom>
              ) : (
                <video src={media.media_url} controls autoPlay muted />
              ))}
          </div>
          <div className="right-view">
            <div className="right-top-view">
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
                        src={getImageReactionWithId(
                          media?.reaction?.feeling_id
                        )}
                        alt="heart"
                      />
                    </button>
                    <span>{media?.reaction_user_count}</span>
                  </div>

                  <button onClick={handleDownload}>
                    <img src={download} alt="download" />
                  </button>
                  <button>
                    <img src={more} alt="more" />
                  </button>
                </div>
                <div className="action-right">
                  <Dropdown
                    overlay={albumMenu} // Pass the dynamically fetched album data to the dropdown
                    placement="bottomLeft"
                    trigger={["click"]}
                    onOpenChange={fetchAlbumData} // Fetch album data when the dropdown is clicked
                    className="dropdown_item"
                  >
                    <button className="album">
                      Album
                      <DownOutlined
                        style={{ marginLeft: "5px", fontWeight: "600" }}
                      />
                    </button>
                  </Dropdown>

                  <button className="save">Save</button>
                </div>
              </div>
            </div>

            <div className="main-view">
              {media?.media_name && (
                <div className="media_name">
                  <span>{media.media_name}</span>
                </div>
              )}

              <div className="user_owner">
                <div className="user">
                  {media?.ownerUser && (
                    <>
                      <img src={media.ownerUser.avatar} alt="owner" />
                      <div className="info">
                        <span style={{ fontWeight: "bold" }}>
                          {media.ownerUser.first_name}{" "}
                          {media.ownerUser.last_name}
                        </span>
                        <span>{media.numberUserFollowers} follower</span>
                      </div>
                    </>
                  )}
                </div>
                {media?.ownerUser.id !== tokenPayload.id &&
                  (media?.ownerUser?.isFollowing ? (
                    <button onClick={handleWithOwnerUser} className="following">
                      Following
                    </button>
                  ) : (
                    <button onClick={handleWithOwnerUser} className="follow">
                      Follow
                    </button>
                  ))}
              </div>

              {media?.description && (
                <div className="description">
                  <span>{media.description}</span>
                </div>
              )}
              <div className="comments">
                {media?.is_comment ? (
                  media?.userComments && <ListComments media={media} />
                ) : (
                  <p className="no_comment">
                    Comments are turned off for this Media
                  </p>
                )}
              </div>
            </div>
            <div className="right-bottom-view">
              {media?.is_comment && <Comment />}
            </div>
          </div>
        </div>
      </motion.div>
      <MediaList 
        queryKey={["medias", "detail-page"]}
        queryFn={(pageParam) => getAllMedias({ pageParam })}
      />
    </Loading>
  );
};

export default DetailMedia;
