import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { clsx } from "clsx";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";

import { getAllMedias } from "@/api/media";
import download from "@/assets/img/PinCap/download.png";
import more from "@/assets/img/PinCap/more.png";
import AlbumDropdown from "@/components/albumDropdown";
import BackButton from "@/components/backButton/BackButton";
import FollowButton from "@/components/FollowButton";
import Loading from "@/components/loading/Loading";
import MediaViewer from "@/components/mediaViewer/MediaViewer";
import MediaList from "@/components/viewPin/ViewPinComponent";
import { ROUTES } from "@/constants/routes";
import { useMedia } from "@/react-query/useMedia";
import { TokenPayload } from "@/types/Auth";
import { Media } from "@/types/type";
import { FeelingType, getImageReactionWithId } from "@/utils/utils";

import Comment from "./Comment/Comment";
import ListComments from "./ListComments/ListComments";

import "./index.less";

const DetailMedia = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || location.state?.mediaId;
  const tokenPayload = useSelector(
    (state: { auth: TokenPayload }) => state.auth
  );

  const { mediaReaction, mediaReactionLoading } = useMedia();

  const {
    data: mediaData,
    isLoading: loading,
    error: queryError,
  } = useMedia().getMediaById(id);

  const [media, setMedia] = useState<Media | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shouldOpenComments, setShouldOpenComments] = useState(false);

  // Redirect to 404 if no media ID provided
  useEffect(() => {
    if (!id) {
      navigate(ROUTES.NOT_FOUND, { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    const rightLayout = document.querySelector(".right-layout");
    if (rightLayout) {
      rightLayout.scrollTo({ top: 0, left: 0 });
    } else {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [location.pathname]);

  // Redirect to 404 if media not found
  useEffect(() => {
    if (!loading && !mediaData && queryError) {
      navigate(ROUTES.NOT_FOUND, { replace: true });
    }
  }, [loading, mediaData, queryError, navigate]);

  useEffect(() => {
    if (mediaData) {
      setMedia(mediaData);
    }
    if (queryError) {
      setError("Lỗi khi lấy chi tiết media: " + queryError.message);
    }
  }, [mediaData, queryError]);

  const handleFollowChange = (isFollowing: boolean, followersCount: number) => {
    setMedia((prevState) => {
      if (!prevState) return null;
      return {
        ...prevState,
        numberUserFollowers: followersCount,
        ownerUser: {
          ...prevState.ownerUser,
          isFollowing: isFollowing,
        },
      };
    });
  };

  const handleReaction = async () => {
    try {
      const feelingId = FeelingType.HEART; // Hiện tại chỉ có một icon
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

  const handleNavigateToProfile = () => {
    if (!media?.ownerUser?.id) return;

    if (media.ownerUser.id === tokenPayload.id) {
      navigate(ROUTES.PROFILE);
    } else {
      navigate(ROUTES.USER_PROFILE.replace(":id", media.ownerUser.id));
    }
  };

  const handleCommentAdded = () => {
    console.log("Comment added, opening comments dropdown");
    setShouldOpenComments(true);
    // Reset after a longer delay to allow the comment to be added and dropdown to open
    setTimeout(() => {
      console.log("Resetting shouldOpenComments to false");
      setShouldOpenComments(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Loading isLoading={loading}>
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
              <MediaViewer media={media} />
            </div>
            <div className="right-view">
              <div className="right-top-view">
                <div className="action">
                  <div className="action-left">
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => handleReaction()}
                        disabled={mediaReactionLoading}
                        className={clsx(
                          mediaReactionLoading &&
                            "opacity-60 cursor-not-allowed"
                        )}
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
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      }
                    />

                    <AlbumDropdown
                      mediaId={id}
                      componentId={`detail-media-save-${id}`}
                      position="click"
                      trigger={<button className="save">Save</button>}
                    />
                  </div>
                </div>
              </div>

              <div className="main-view custom-scroll-bar">
                {media?.media_name && (
                  <div className="media_name">
                    <span>{media.media_name}</span>
                  </div>
                )}

                <div
                  className={clsx(
                    "user_owner sticky top-0 !z-20 bg-white !pb-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                  )}
                >
                  <div
                    className="user cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={handleNavigateToProfile}
                  >
                    {media?.ownerUser && (
                      <>
                        <img src={media.ownerUser.avatar} alt="owner" />
                        <div className="info">
                          <span className="font-bold">
                            {media.ownerUser.first_name}{" "}
                            {media.ownerUser.last_name}
                          </span>
                          <span>{media.numberUserFollowers} follower</span>
                        </div>
                      </>
                    )}
                  </div>
                  {media?.ownerUser.id !== tokenPayload.id && (
                    <FollowButton
                      userId={media?.ownerUser?.id || ""}
                      initialIsFollowing={media?.ownerUser?.isFollowing}
                      initialFollowersCount={media?.numberUserFollowers || 0}
                      onFollowChange={handleFollowChange}
                      variant="default"
                    />
                  )}
                </div>

                {media?.description && (
                  <div className="description">
                    <span>{media.description}</span>
                  </div>
                )}
                <div className="comments">
                  {media?.is_comment && (
                    <ListComments
                      mediaId={media.id || id}
                      initialCommentCount={media.commentCount || 0}
                      defaultOpen={shouldOpenComments}
                    />
                  )}
                  {!media?.is_comment && (
                    <p className="no_comment">
                      Comments are turned off for this Media
                    </p>
                  )}
                </div>
              </div>
              <div className="right-bottom-view">
                {media?.is_comment && (
                  <Comment mediaId={id} onCommentAdded={handleCommentAdded} />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </Loading>

      <MediaList
        queryKey={["medias", "detail-page"]}
        queryFn={(pageParam) => getAllMedias({ pageParam })}
      />
    </div>
  );
};

export default DetailMedia;
