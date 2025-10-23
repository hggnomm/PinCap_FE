import React, { useEffect, useMemo, useState } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import clsx from "clsx";
import { motion } from "framer-motion";

import { EditFilled } from "@ant-design/icons/lib";

import { Form } from "antd";

import { getDetailMedia } from "@/api/media";
import AlbumDropdown from "@/components/albumDropdown";
import DotsPagination from "@/components/dotsPagination/DotsPagination";
import { DeleteMediaModal, EditMediaModal } from "@/components/modal/media";
import { MEDIA_TYPES } from "@/constants/constants";
import { useMedia } from "@/react-query/useMedia";
import { ParsedMediaUrl, parseMediaUrl } from "@/utils/utils";

import "react-lazy-load-image-component/src/effects/blur.css";
import "react-medium-image-zoom/dist/styles.css";

import { Media } from "type";
import "./index.less";

interface PinMediaProps extends React.HTMLAttributes<HTMLParagraphElement> {
  innerRef?: React.Ref<HTMLParagraphElement>;
  srcUrl: string;
  data: {
    id: string;
    media_name: string;
    media_url: string;
    type: string;
  };
  isEditMedia?: boolean;
  isSaveMedia?: boolean;
  onDelete?: () => void;
  albumContext?: { inAlbum: boolean; albumId?: string; onRemoved?: () => void };
}

const PinMedia: React.FC<PinMediaProps> = (props) => {
  const {
    srcUrl,
    data,
    isEditMedia,
    isSaveMedia = true,
    onDelete,
    albumContext,
  } = props;
  const { updateMedia, deleteMedia } = useMedia();
  const [media, setMedia] = useState<Media>();
  const navigate = useNavigate();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [form] = Form.useForm<Media>();
  const [privacy, setPrivacy] = useState(false);
  const [isComment, setIsComment] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const isFlexibleMedia =
    data?.type === MEDIA_TYPES.FLEXIBLE ||
    data?.type === null ||
    data?.type === "";
  const flexibleMediaUrls: ParsedMediaUrl[] = isFlexibleMedia
    ? parseMediaUrl(data?.media_url)
    : [];
  const currentFlexibleMedia =
    flexibleMediaUrls.length > 0 ? flexibleMediaUrls[currentMediaIndex] : null;

  const isFlexibleVideo = useMemo(() => {
    return (
      isFlexibleMedia &&
      currentFlexibleMedia &&
      currentFlexibleMedia.type === MEDIA_TYPES.VIDEO
    );
  }, [isFlexibleMedia, currentFlexibleMedia]);

  const isFlexibleImage = useMemo(() => {
    return (
      isFlexibleMedia &&
      currentFlexibleMedia &&
      currentFlexibleMedia.type === MEDIA_TYPES.IMAGE
    );
  }, [isFlexibleMedia, currentFlexibleMedia]);

  useEffect(() => {
    if (editModalVisible && isFirstOpen) {
      fetchMediaDetail(data.id);
      setIsFirstOpen(false); // After fetch media, set false
    }
  }, [editModalVisible, isFirstOpen]);

  const fetchMediaDetail = async (idMedia: string) => {
    setLoading(true);
    setError(null);
    try {
      const detail: Media = await getDetailMedia(idMedia);
      if (detail) {
        setMedia(detail);
        form.setFieldsValue({
          media_name: detail?.media_name,
          description: detail?.description,
        });
        setPrivacy(detail.privacy === "PRIVATE");
        setIsComment(detail.is_comment);
      }
    } catch (error) {
      setError("Error fetching details media: " + error);
    } finally {
      setLoading(false);
    }
  };

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
        {data?.type === MEDIA_TYPES.VIDEO && (
          <video autoPlay loop muted>
            <source src={srcUrl} />
          </video>
        )}
        {data?.type === MEDIA_TYPES.IMAGE && (
          <LazyLoadImage
            src={srcUrl}
            alt="Media content"
            effect="blur"
            threshold={100}
          />
        )}
        {isFlexibleVideo && (
          <video autoPlay loop muted>
            <source src={currentFlexibleMedia!.url} />
          </video>
        )}
        {isFlexibleImage && (
          <LazyLoadImage
            src={currentFlexibleMedia!.url}
            alt="Media content"
            effect="blur"
            threshold={100}
          />
        )}

        <motion.div
          className={clsx(
            "overlay absolute top-0 left-0 right-0 bg-black/40 opacity-0 transition-opacity duration-300 z-[1] rounded-[15px]",
            {
              "bottom-[5px]":
                data?.type === MEDIA_TYPES.IMAGE || isFlexibleImage,
              "bottom-0": data?.type === MEDIA_TYPES.VIDEO || isFlexibleVideo,
            }
          )}
          whileHover={{ opacity: 1 }}
        >
          {isEditMedia && (
            <div
              className="right-bottom circle-button"
              onClick={(e) => {
                setEditModalVisible(true);
                e.stopPropagation();
              }}
            >
              <EditFilled />
            </div>
          )}
        </motion.div>

        {/* AlbumDropdown positioned outside overlay to avoid opacity issues */}
        {isSaveMedia && (
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
                  "save-button right-top transition-opacity duration-300",
                  isHovered || dropdownOpen ? "opacity-100" : "opacity-0"
                )}
              >
                <p>Save</p>
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
            className="absolute bottom-[0.83vw] left-1/2 -translate-x-1/2 [&>div]:w-1 [&>div]:h-1"
          />
        )}
      </motion.div>

      {/* Edit Media Modal */}
      <EditMediaModal
        visible={editModalVisible}
        media={loading ? null : media || null}
        onCancel={() => {
          setEditModalVisible(false);
          setIsFirstOpen(true); // Reset for next open
        }}
        onDeleteClick={() => {
          setEditModalVisible(false);
          setDeleteModalVisible(true);
        }}
        onSuccess={() => {
          // Refetch media detail to update UI
          fetchMediaDetail(data.id);
        }}
        inAlbumContext={!!albumContext?.inAlbum}
        albumId={albumContext?.albumId}
        onRemovedFromAlbum={() => {
          albumContext?.onRemoved?.();
        }}
      />

      {/* Delete Media Modal */}
      <DeleteMediaModal
        visible={deleteModalVisible}
        media={media || null}
        onCancel={() => {
          setDeleteModalVisible(false);
          setEditModalVisible(true);
        }}
        onConfirm={handleDeleteMedia}
      />
    </>
  );
};

export default PinMedia;
