import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./index.less";
import { EditFilled } from "@ant-design/icons/lib";
import ModalComponent from "@/components/modal/ModalComponent";
import { toast } from "react-toastify";
import { getDetailMedia } from "@/api/media";
import { Media } from "type";
import { Form, Input } from "antd";
import FieldItem from "@/components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "@/components/form/checkbox/CheckBoxComponent";
import Loading from "@/components/loading/Loading";
import { useSelector } from "react-redux";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AlbumDropdown from "@/components/albumDropdown";
import clsx from "clsx";
import { MEDIA_TYPES, PRIVACY } from "@/constants/constants";
import { parseMediaUrl, ParsedMediaUrl } from "@/utils/utils";
import DotsPagination from "@/components/dotsPagination/DotsPagination";
import { useMedia } from "@/hooks/useMedia";
import { EditMediaModal, DeleteMediaModal } from "@/components/modal/media";

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
  onDelete?: () => void;
}

const PinMedia: React.FC<PinMediaProps> = (props) => {
  const { srcUrl, data, isEditMedia, onDelete } = props;
  const tokenPayload = useSelector((state: any) => state.auth);
  const { updateMedia, deleteMedia } = useMedia();
  const [media, setMedia] = useState<Media>();
  const navigate = useNavigate();
  const isMp4 = srcUrl?.endsWith(".mp4");
  const [modalVisible, setModalVisible] = useState(false);
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

  const isFlexibleMedia = data?.type === MEDIA_TYPES.FLEXIBLE || data?.type === null || data?.type === "";
  const flexibleMediaUrls: ParsedMediaUrl[] = isFlexibleMedia ? parseMediaUrl(data?.media_url) : [];
  const currentFlexibleMedia = flexibleMediaUrls.length > 0 ? flexibleMediaUrls[currentMediaIndex] : null;
  
  const isFlexibleVideo = useMemo(() => {
    return isFlexibleMedia && currentFlexibleMedia && currentFlexibleMedia.type === MEDIA_TYPES.VIDEO;
  }, [isFlexibleMedia, currentFlexibleMedia]);

  const isFlexibleImage = useMemo(() => {
    return isFlexibleMedia && currentFlexibleMedia && currentFlexibleMedia.type === MEDIA_TYPES.IMAGE;
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

  const handleDeleteAction = () => {
    setDeleteModalVisible(true);
    setEditModalVisible(false);
  };

  const handleCancel = () => {
    setEditModalVisible(false);
    setDeleteModalVisible(false);
  };

  const handleConfirm = async () => {
    try {
      const formValue = await form.validateFields();

      const updatedData = {
        media_name: formValue.media_name,
        description: formValue.description,
        privacy: privacy ? PRIVACY.PRIVATE : PRIVACY.PUBLIC,
        is_comment: isComment,
      };

      await updateMedia({ id: data.id, data: updatedData });
      
      setModalVisible(false);
      toast.success("Media updated successfully!");
    } catch (error) {
      console.error("Validation failed:", error);
      toast.error(
        "Validation failed: Please check the form fields and try again."
      );
    }
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
              "bottom-[5px]": data?.type === MEDIA_TYPES.IMAGE || isFlexibleImage,
              "bottom-0": data?.type === MEDIA_TYPES.VIDEO || isFlexibleVideo
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
        {(isHovered || dropdownOpen) && (
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
              <div className="save-button right-top">
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
        media={loading ? null : (media || null)}
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
