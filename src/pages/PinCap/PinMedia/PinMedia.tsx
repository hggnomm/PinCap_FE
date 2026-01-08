import React, {
  useEffect,
  useMemo,
  useState,
  Suspense,
  lazy,
  useCallback,
  HTMLAttributes,
} from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { clsx } from "clsx";
import { motion } from "framer-motion";

import { EditFilled, ExclamationCircleOutlined } from "@ant-design/icons/lib";

import { Form } from "antd";

import { getDetailMedia } from "@/api/media";
import AlbumDropdown from "@/components/AlbumDropdown";
import DotsPagination from "@/components/DotsPagination/DotsPagination";
import MediaErrorThumbnail from "@/components/MediaErrorThumbnail";
import InfoTooltip from "@/components/Tooltip/InfoTooltip";
import { MEDIA_TYPES } from "@/constants/constants";
import { useMediaError } from "@/hooks";
import { useMedia } from "@/react-query/useMedia";
import { TokenPayload } from "@/types/Auth";
import { SafeSearchData } from "@/types/vision";
import {
  ParsedMediaUrl,
  parseMediaUrl,
  normalizeMediaUrl,
} from "@/utils/utils";
import { checkImagePolicy } from "@/utils/visionUtils";

import "react-lazy-load-image-component/src/effects/blur.css";
import "react-medium-image-zoom/dist/styles.css";

import { Media } from "type";
import "./index.less";

const EditMediaModal = lazy(
  () => import("@/components/Modal/media/EditMediaModal")
);
const DeleteMediaModal = lazy(
  () => import("@/components/Modal/media/DeleteMediaModal")
);
interface PinMediaProps extends HTMLAttributes<HTMLParagraphElement> {
  innerRef?: React.Ref<HTMLParagraphElement>;
  srcUrl: string | string[] | null;
  data: {
    id: string;
    media_name: string;
    media_url: string | string[] | null;
    type: string;
  };
  isEditMedia?: boolean;
  isSaveMedia?: boolean;
  onDelete?: () => void;
  albumContext?: { inAlbum: boolean; albumId?: string; onRemoved?: () => void };
  mediaFromAlbum?: Media;
}

const PinMedia: React.FC<PinMediaProps> = (props) => {
  const {
    srcUrl,
    data,
    isEditMedia,
    isSaveMedia = true,
    onDelete,
    albumContext,
    mediaFromAlbum,
  } = props;
  const { deleteMedia } = useMedia();
  const [media, setMedia] = useState<Media | undefined>(mediaFromAlbum);
  const navigate = useNavigate();
  const tokenPayload = useSelector(
    (state: { auth: TokenPayload }) => state.auth
  );
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [form] = Form.useForm<Media>();

  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const {
    imageError,
    videoError,
    flexibleMediaErrors,
    handleImageError,
    handleVideoError,
    handleFlexibleImageError,
    handleFlexibleVideoError,
    resetFlexibleMediaErrors,
  } = useMediaError({
    mediaId: data?.id,
    resetOnMediaChange: true,
  });

  const isFlexibleMedia =
    data?.type === MEDIA_TYPES.FLEXIBLE ||
    data?.type === null ||
    data?.type === "";
  const flexibleMediaUrls: ParsedMediaUrl[] = isFlexibleMedia
    ? parseMediaUrl(data?.media_url)
    : [];
  const currentFlexibleMedia =
    flexibleMediaUrls.length > 0 ? flexibleMediaUrls[currentMediaIndex] : null;

  // Normalize once - no more Array.isArray checks!
  const normalizedUrls = useMemo(() => normalizeMediaUrl(srcUrl), [srcUrl]);
  const displayUrl = normalizedUrls[0] || "";

  useEffect(() => {
    resetFlexibleMediaErrors();
  }, [currentMediaIndex, resetFlexibleMediaErrors]);

  // Determine media type for rendering
  const mediaType = useMemo(() => {
    if (isFlexibleMedia && currentFlexibleMedia) {
      return currentFlexibleMedia.type;
    }
    return data?.type;
  }, [isFlexibleMedia, currentFlexibleMedia, data?.type]);

  const isVideo = mediaType === MEDIA_TYPES.VIDEO;
  const isImage = mediaType === MEDIA_TYPES.IMAGE;

  // Get current media URL and error state
  const currentMediaUrl =
    isFlexibleMedia && currentFlexibleMedia
      ? currentFlexibleMedia.url
      : displayUrl;

  // Check image policy for sensitive content
  const imagePolicyStatus = useMemo(() => {
    if (!isImage) return null;
    const mediaData = media || mediaFromAlbum;
    if (mediaData?.safe_search_data) {
      const safeSearchData =
        mediaData.safe_search_data as unknown as SafeSearchData[];
      if (Array.isArray(safeSearchData)) {
        return checkImagePolicy(safeSearchData);
      }
    }
    return null;
  }, [isImage, media, mediaFromAlbum]);

  const hasSensitiveContent = imagePolicyStatus?.status === "WARNING";

  // Check if current user is the owner of the media
  const isOwner = useMemo(() => {
    const mediaData = media || mediaFromAlbum;
    if (!mediaData || !tokenPayload?.id) return false;
    return (
      mediaData.ownerUser?.id === tokenPayload.id ||
      mediaData.media_owner_id === tokenPayload.id
    );
  }, [media, mediaFromAlbum, tokenPayload?.id]);

  // Hide save button if has sensitive content and not owner
  const shouldShowSaveButton = isSaveMedia && (!hasSensitiveContent || isOwner);

  const hasError = isFlexibleMedia
    ? flexibleMediaErrors[currentMediaIndex]
    : isVideo
    ? videoError
    : imageError;

  const handleMediaError = isFlexibleMedia
    ? isVideo
      ? () => handleFlexibleVideoError(currentMediaIndex)
      : () => handleFlexibleImageError(currentMediaIndex)
    : isVideo
    ? handleVideoError
    : handleImageError;

  const fetchMediaDetail = useCallback(
    async (idMedia: string) => {
      try {
        const detail: Media = await getDetailMedia(idMedia, true);
        if (detail) {
          setMedia(detail);
          form.setFieldsValue({
            media_name: detail?.media_name,
            description: detail?.description,
          });
        }
      } catch (error) {
        console.error("Error fetching details media: " + error);
      }
    },
    [form]
  );

  useEffect(() => {
    if (editModalVisible && isFirstOpen) {
      fetchMediaDetail(data.id);
      setIsFirstOpen(false);
    }
  }, [editModalVisible, isFirstOpen, data.id, fetchMediaDetail]);

  const handleCancel = () => {
    setEditModalVisible(false);
    setDeleteModalVisible(false);
  };

  const handleDeleteMedia = async () => {
    try {
      await deleteMedia([data.id]);

      handleCancel();
      toast.success("Media deleted successfully!");

      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error(
        "An error occurred while deleting the media. Please try again."
      );
    }
  };

  return (
    <>
      <motion.div
        className="box relative overflow-hidden"
        onClick={() => {
          // Block navigation when modal is open
          if (!modalOpen) {
            navigate(`/media/${data?.id}`, { state: { mediaId: data?.id } });
          }
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {hasError && (
          <MediaErrorThumbnail
            className="mb-1 w-full rounded-2xl block"
            width="100%"
            height="auto"
            alt={`${isVideo ? "Video" : "Image"} error`}
          />
        )}

        {!hasError && isVideo && (
          <video
            autoPlay
            loop
            muted
            className="mb-2 w-full h-auto rounded-2xl block"
            onError={handleMediaError}
          >
            <source src={currentMediaUrl} />
          </video>
        )}

        {!hasError && isImage && (
          <div
            className={clsx(
              "mb-1 w-full h-auto rounded-2xl block overflow-hidden relative",
              hasSensitiveContent && "mb-2"
            )}
          >
            <LazyLoadImage
              src={currentMediaUrl}
              alt="Media content"
              effect={hasSensitiveContent ? "opacity" : "blur"}
              threshold={100}
              onError={handleMediaError}
              className={clsx(
                "w-full h-auto block transition-all duration-300",
                hasSensitiveContent && "blur-md"
              )}
            />
            {hasSensitiveContent && imagePolicyStatus?.message && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <InfoTooltip
                  title={imagePolicyStatus.message}
                  placement="top"
                  className="pointer-events-auto"
                >
                  <div className="size-8 bg-black rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <ExclamationCircleOutlined
                      style={{ color: "white" }}
                      className="text-3xl"
                    />
                  </div>
                </InfoTooltip>
              </div>
            )}
          </div>
        )}

        <motion.div
          className={clsx(
            "overlay absolute top-0 left-0 right-0 bg-black/40 opacity-0 transition-opacity duration-300 z-20 rounded-[15px]",
            hasSensitiveContent ? "bottom-2" : "bottom-2.25"
          )}
          whileHover={{ opacity: 1 }}
        >
          {isEditMedia && (
            <div
              className="absolute bottom-2.5 right-2.5 w-10 h-10 bg-white rounded-full flex justify-center items-center shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer z-30"
              onClick={(e) => {
                setEditModalVisible(true);
                e.stopPropagation();
              }}
            >
              <EditFilled />
            </div>
          )}
        </motion.div>

        {shouldShowSaveButton && (
          <AlbumDropdown
            mediaId={data.id}
            componentId={`pin-media-${data.id}`}
            position="click"
            className="absolute top-2 right-2 z-10"
            onOpen={() => setDropdownOpen(true)}
            onClose={() => setDropdownOpen(false)}
            onModalOpen={() => setModalOpen(true)}
            onModalClose={() => setModalOpen(false)}
            trigger={
              <div
                className={clsx(
                  "w-12 h-7 bg-pink-600 rounded-2xl flex justify-center items-center shadow-md transition-all duration-200 hover:scale-105 active:scale-95 active:bg-rose-800 cursor-pointer",
                  isHovered || dropdownOpen ? "opacity-100" : "opacity-0"
                )}
              >
                <p className="text-white font-medium text-base select-none">
                  Save
                </p>
              </div>
            }
          />
        )}

        {/* DotsPagination for flexible media */}
        {isFlexibleMedia && flexibleMediaUrls.length > 1 && (
          <DotsPagination
            total={flexibleMediaUrls.length}
            current={currentMediaIndex}
            onDotClick={setCurrentMediaIndex}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 [&>div]:w-1 [&>div]:h-1"
          />
        )}
      </motion.div>

      <Suspense fallback={<></>}>
        <EditMediaModal
          visible={editModalVisible}
          media={media ?? mediaFromAlbum ?? null}
          onCancel={() => {
            setEditModalVisible(false);
            setIsFirstOpen(true);
          }}
          onDeleteClick={() => {
            setEditModalVisible(false);
            setDeleteModalVisible(true);
          }}
          onSuccess={async () => {
            fetchMediaDetail(data.id);
          }}
          inAlbumContext={!!albumContext?.inAlbum}
          albumId={albumContext?.albumId}
          onRemovedFromAlbum={() => {
            albumContext?.onRemoved?.();
          }}
        />

        <DeleteMediaModal
          visible={deleteModalVisible}
          media={media || null}
          onCancel={() => {
            setDeleteModalVisible(false);
            setEditModalVisible(true);
          }}
          onConfirm={handleDeleteMedia}
        />
      </Suspense>
    </>
  );
};

export default PinMedia;
