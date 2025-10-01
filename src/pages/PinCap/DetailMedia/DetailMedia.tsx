import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getAllMedias } from "@/api/media";

import { motion } from "framer-motion";
import download from "@/assets/img/PinCap/download.png";
import more from "@/assets/img/PinCap/more.png";
import { notification } from "antd";
import Loading from "@/components/loading/Loading";
import AlbumDropdown from "@/components/albumDropdown";

import "./index.less";
import { Media } from "@/types/type";
import { FeelingType, getImageReactionWithId } from "@/utils/utils";
import Comment from "./Comment/Comment";
import { useSelector } from "react-redux";
import { saveAs } from "file-saver";
import BackButton from "@/components/backButton/BackButton";
import MediaList from "@/components/viewPin/ViewPinComponent";
import ListComments from "./ListComments/ListComments";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useMedia } from "@/hooks/useMedia";
import { useUser } from "@/hooks/useUser";
interface TokenPayload {
  id: string;
}

const DetailMedia = () => {
  const location = useLocation();
  const id = location.state?.mediaId;
  const tokenPayload = useSelector((state: any) => state.auth) as TokenPayload;
  
  const { mediaReaction, mediaReactionLoading } = useMedia();
  const { followOrBlockUser: followUser, unfollowOrUnblockUser: unfollowUser } = useUser();
  
  const { data: mediaData, isLoading: loading, error: queryError } = useMedia().getMediaById(id);
  
  const [media, setMedia] = useState<Media | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mediaData) {
      setMedia(mediaData);
    }
    if (queryError) {
      setError("Lỗi khi lấy chi tiết media: " + queryError.message);
    }
  }, [mediaData, queryError]);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleWithOwnerUser = async () => {
    const request = "FOLLOWING";

    try {
      if (media?.ownerUser?.isFollowing) {
        if (!media?.ownerUser?.id) {
          setError("User ID not found!");
          return;
        }

        await unfollowUser({
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

      const response = await followUser({
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

      // Use React Query hook instead of direct API call
      const response = await mediaReaction({
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
            {media && media.type === "IMAGE" && (
              <Zoom>
                <img src={media.media_url} alt={media.media_name} />
              </Zoom>
            )}
            {media && media.type !== "IMAGE" && (
              <video src={media.media_url} controls autoPlay muted />
            )}
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
                    <button 
                      onClick={() => handleReaction()}
                      disabled={mediaReactionLoading}
                      style={{
                        opacity: mediaReactionLoading ? 0.6 : 1,
                        cursor: mediaReactionLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
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
                <div className="action-right flex">
                  <AlbumDropdown
                    mediaId={id}
                    componentId={`detail-media-${id}`}
                    position="click"
                    trigger={
                      <button className="album">
                        Album
                        <svg 
                          className="inline-block ml-1 w-4 h-4" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    }
                  />

                  <button className="save">Save</button>
                </div>
              </div>
            </div>

            <div className="main-view custom-scroll-bar">
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
                {media?.ownerUser.id !== tokenPayload.id && media?.ownerUser?.isFollowing && (
                  <button onClick={handleWithOwnerUser} className="following">
                    Following
                  </button>
                )}
                {media?.ownerUser.id !== tokenPayload.id && !media?.ownerUser?.isFollowing && (
                  <button onClick={handleWithOwnerUser} className="follow">
                    Follow
                  </button>
                )}
              </div>

              {media?.description && (
                <div className="description">
                  <span>{media.description}</span>
                </div>
              )}
              <div className="comments">
                {media?.is_comment && media?.userComments && (
                  <ListComments media={media} />
                )}
                {!media?.is_comment && (
                  <p className="no_comment">
                    Comments are turned off for this Media
                  </p>
                )}
              </div>
            </div>
            <div className="right-bottom-view">
              {media?.is_comment && <Comment mediaId={id} />}
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
