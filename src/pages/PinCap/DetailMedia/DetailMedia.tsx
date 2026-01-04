import {
  useCallback,
  useEffect,
  useRef,
  useState,
  Suspense,
  lazy,
  useMemo,
} from "react";

import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useInfiniteQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";

import { getAllMedias } from "@/api/media";
import { trackUserEvent } from "@/api/users";
import INSTAGRAM_ICON from "@/assets/icons/instagram-2.svg";
import DOWNLOAD from "@/assets/img/PinCap/download.png";
import MORE from "@/assets/img/PinCap/more.png";
import AlbumDropdown from "@/components/AlbumDropdown";
import BackButton from "@/components/BackButton/BackButton";
import ButtonCircle from "@/components/ButtonCircle/ButtonCircle";
import FollowButton from "@/components/FollowButton";
import Loading from "@/components/Loading/Loading";
import MediaViewer from "@/components/MediaViewer/MediaViewer";
import MediaList from "@/components/ViewPin/ViewPinComponent";
import { ROUTES } from "@/constants/routes";
import { useMedia } from "@/react-query/useMedia";
import { TokenPayload } from "@/types/Auth";
import { PaginatedMediaResponse } from "@/types/Media/MediaResponse";
import { Media } from "@/types/type";
import { SafeSearchData } from "@/types/vision";
import {
  FeelingType,
  getImageReactionWithId,
  normalizeMediaUrl,
} from "@/utils/utils";
import { checkImagePolicy } from "@/utils/visionUtils";

import Comment from "./Comment/Comment";
import ListComments from "./ListComments/ListComments";

import "./index.less";

const EditMediaModal = lazy(
  () => import("@/components/Modal/media/EditMediaModal")
);
const DeleteMediaModal = lazy(
  () => import("@/components/Modal/media/DeleteMediaModal")
);

const DetailMedia = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || location.state?.mediaId;
  const tokenPayload = useSelector(
    (state: { auth: TokenPayload & { role?: string } }) => state.auth
  );

  // Check if current user is admin from token payload
  const userIsAdmin = useMemo(() => {
    const role = tokenPayload?.role;
    return (
      role === "ADMIN" ||
      role === "admin" ||
      role?.toUpperCase() === "ADMIN" ||
      role?.toLowerCase() === "admin"
    );
  }, [tokenPayload?.role]);

  console.log("userIsAdmin", userIsAdmin);
  const { mediaReaction, mediaReactionLoading } = useMedia();
  const { deleteMedia } = useMedia();
  const {
    data: mediaData,
    isLoading: loading,
    error: queryError,
  } = useMedia().getMediaById(id, true);

  const [media, setMedia] = useState<Media | null>(null);

  // Check if user can perform actions (owner or admin)
  // Use useMemo to recalculate when media or userIsAdmin changes
  const canPerformActions = useMemo(() => {
    const isOwner = media?.ownerUser?.id === tokenPayload.id;
    const result = isOwner || userIsAdmin;

    return result;
  }, [media?.ownerUser?.id, tokenPayload.id, userIsAdmin]);
  const [shouldOpenComments, setShouldOpenComments] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [hasAcceptedSensitiveView, setHasAcceptedSensitiveView] =
    useState(false);
  const trackedMediaListRef = useRef<string[]>([]);
  const lastTrackedMediaIdRef = useRef<string | null>(null);

  // Check image policy for sensitive content
  const imagePolicyStatus = useMemo(() => {
    if (!media?.safe_search_data) return null;
    const safeSearchData =
      media.safe_search_data as unknown as SafeSearchData[];
    if (Array.isArray(safeSearchData)) {
      return checkImagePolicy(safeSearchData);
    }
    return null;
  }, [media?.safe_search_data]);

  const hasSensitiveContent = imagePolicyStatus?.status === "WARNING";
  const shouldBlockContent = hasSensitiveContent && !hasAcceptedSensitiveView;

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
      // Reset accept state when media changes
      setHasAcceptedSensitiveView(false);
    }
  }, [mediaData, queryError]);

  // Track view event is handled in trackMediaList when media list is loaded
  // Only track if there are media_ids in the list

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
      const isLiking = media?.reaction?.feeling_id !== feelingId;

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
        setMedia((prevState: Media | null): Media | null => {
          if (!prevState) return null;
          return {
            ...prevState,
            reaction_user_count: Math.max(0, newReactionCount),
            reaction: {
              ...prevState.reaction,
              feeling_id:
                prevState.reaction?.feeling_id === feelingId ? null : feelingId,
              id: prevState.reaction?.id || "",
            },
          } as Media;
        });

        // Track like event when user likes (not unlikes)
        if (isLiking && id) {
          trackUserEvent({
            event_type: "like",
            media_id: id,
            metadata: null,
          }).catch((error) => {
            console.error("Failed to track like event:", error);
          });
        }
      }
    } catch (error: unknown) {
      console.error("Error when reacting to a media:", error);
    }
  };

  const handleDownload = () => {
    if (media?.media_url) {
      // Normalize once - no more Array.isArray checks!
      const urls = normalizeMediaUrl(media.media_url);
      if (urls[0]) {
        saveAs(urls[0], media.media_name || "downloaded-file");
      }
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

  const handleEditMedia = () => {
    setIsEditModalVisible(true);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditModalSuccess = () => {
    if (mediaData) {
      setMedia(mediaData);
    }
  };

  const handleDeleteMedia = () => {
    setIsDeleteModalVisible(true);
    setIsEditModalVisible(false);
  };

  const handleDeleteModalCancel = () => {
    setIsDeleteModalVisible(false);
    setIsEditModalVisible(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      await deleteMedia([media?.id || ""]);
      toast.success("Media deleted successfully!");
      setIsDeleteModalVisible(false);
      setIsEditModalVisible(false);
      navigate(ROUTES.MY_MEDIA);
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const getAllMediasWithFallback = async (
    pageParam: number
  ): Promise<PaginatedMediaResponse<Media>> => {
    if (!id) {
      return getAllMedias({ page: pageParam });
    }

    const responseWithMediaId = await getAllMedias({
      page: pageParam,
      media_id: id,
    });

    if (
      !responseWithMediaId.data ||
      responseWithMediaId.data.length === 0 ||
      responseWithMediaId.total === 0
    ) {
      return getAllMedias({ page: pageParam });
    }

    return responseWithMediaId;
  };

  // Query to get media list for tracking
  const { data: mediaListData, isSuccess: isMediaListSuccess } =
    useInfiniteQuery({
      queryKey: ["medias", "detail-page", id],
      queryFn: ({ pageParam }) => getAllMediasWithFallback(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.current_page < lastPage.last_page) {
          return lastPage.current_page + 1;
        }
        return undefined;
      },
      enabled: !!id,
    });

  // Function to track list media IDs
  const trackMediaList = useCallback(
    async (mediaIds: string[]) => {
      if (!id || !mediaIds || mediaIds.length === 0) return;

      try {
        await trackUserEvent({
          event_type: "view",
          media_id: id,
          metadata: { media_ids: mediaIds },
        });
      } catch (error) {
        console.error("Failed to track media list:", error);
      }
    },
    [id]
  );

  // Track media list when data is loaded (only page 1)
  // Track every time we navigate to a new media (id changes)
  useEffect(() => {
    // Reset tracked list when media id changes
    if (id && lastTrackedMediaIdRef.current !== id) {
      trackedMediaListRef.current = [];
      lastTrackedMediaIdRef.current = id;
    }

    if (
      isMediaListSuccess &&
      mediaListData?.pages &&
      mediaListData.pages.length > 0 &&
      id
    ) {
      // Only get media IDs from the first page
      const firstPage = mediaListData.pages[0];
      if (firstPage && firstPage.data) {
        const firstPageMediaIds = firstPage.data
          .map((media) => media.id)
          .filter((mediaId): mediaId is string => !!mediaId);

        // Track every time we navigate to this media (id matches current id)
        if (
          firstPageMediaIds.length > 0 &&
          lastTrackedMediaIdRef.current === id &&
          trackedMediaListRef.current.length === 0
        ) {
          // Update tracked list
          trackedMediaListRef.current = firstPageMediaIds;

          // Track the first page list (only if we have media_ids)
          trackMediaList(firstPageMediaIds);
        }
      }
    }
  }, [isMediaListSuccess, mediaListData, id, trackMediaList]);

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
            <div className="left-view relative">
              <MediaViewer
                media={media}
                shouldBlockContent={shouldBlockContent}
                sensitiveMessage={imagePolicyStatus?.message}
                onAcceptSensitiveView={() => setHasAcceptedSensitiveView(true)}
              />
            </div>
            <div className="right-view">
              <div className="right-top-view">
                <div className="action">
                  <div className="action-left">
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => handleReaction()}
                        disabled={mediaReactionLoading || shouldBlockContent}
                        className={clsx(
                          (mediaReactionLoading || shouldBlockContent) &&
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

                    <button
                      onClick={handleDownload}
                      disabled={shouldBlockContent}
                      className={clsx(
                        shouldBlockContent && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      <img src={DOWNLOAD} alt="download" />
                    </button>
                    <ButtonCircle
                      icon={<img src={MORE} alt="more" />}
                      dropdownMenu={[
                        ...(canPerformActions
                          ? [
                              {
                                key: "edit-media",
                                title: "Edit Media",
                                onClick: handleEditMedia,
                              },
                            ]
                          : []),
                        {
                          key: "report-media",
                          title: "Report Media",
                          onClick: () => {
                            // TODO: Implement report media logic
                            console.log("Report Media clicked");
                          },
                        },
                      ]}
                    />
                  </div>
                  <div className="action-right flex">
                    <AlbumDropdown
                      mediaId={id}
                      componentId={`detail-media-${id}`}
                      position="click"
                      disabled={shouldBlockContent}
                      trigger={
                        <button
                          className={clsx(
                            "album",
                            shouldBlockContent &&
                              "opacity-60 cursor-not-allowed"
                          )}
                          disabled={shouldBlockContent}
                        >
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
                      disabled={shouldBlockContent}
                      trigger={
                        <button
                          className={clsx(
                            "save",
                            shouldBlockContent &&
                              "opacity-60 cursor-not-allowed"
                          )}
                          disabled={shouldBlockContent}
                        >
                          Save
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="main-view custom-scroll-bar">
                {media?.media_name && (
                  <div className="media_name ">
                    <span>{media.media_name}</span>
                  </div>
                )}

                {media?.permalink && (
                  <div className="px-5 pt-3 max-w-full overflow-hidden">
                    <a
                      href={media.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 transition-colors min-w-0 max-w-full"
                    >
                      <img
                        src={INSTAGRAM_ICON}
                        alt="Instagram"
                        className="h-4 w-4 shrink-0 transition-opacity group-hover:opacity-80"
                      />
                      <span className="text-sm font-medium text-gray-700 truncate min-w-0 transition-colors group-hover:text-pink-700 dark:text-gray-300 dark:group-hover:text-pink-300">
                        {media.permalink}
                      </span>
                    </a>
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
                  {media?.ownerUser.id !== tokenPayload.id && !userIsAdmin && (
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
        queryKey={["medias", "detail-page", id]}
        queryFn={getAllMediasWithFallback}
      />

      <Suspense fallback={<></>}>
        <EditMediaModal
          visible={isEditModalVisible}
          media={media}
          onCancel={handleEditModalCancel}
          onDeleteClick={handleDeleteMedia}
          onSuccess={handleEditModalSuccess}
        />

        <DeleteMediaModal
          visible={isDeleteModalVisible}
          media={media}
          onCancel={handleDeleteModalCancel}
          onConfirm={handleDeleteConfirm}
        />
      </Suspense>
    </div>
  );
};

export default DetailMedia;
