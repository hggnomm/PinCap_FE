import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./index.less";
import { EditFilled } from "@ant-design/icons/lib";
import ModalComponent from "@/components/modal/ModalComponent";
import { toast } from "react-toastify";
import { deleteMedias, getDetailMedia, updatedMedia } from "@/api/media";
import { Media } from "type";
import { Form, Input } from "antd";
import FieldItem from "@/components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "@/components/form/checkbox/CheckBoxComponent";
import Loading from "@/components/loading/Loading";
import { MediaFormValues } from "Media/MediaRequest";
import { useSelector } from "react-redux";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import AlbumDropdown from "@/components/albumDropdown";
import clsx from "clsx";
import { MEDIA_TYPES } from "@/constants/constants";
import { parseMediaUrl, ParsedMediaUrl } from "@/utils/utils";
import DotsPagination from "@/components/dotsPagination/DotsPagination";

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
  const [media, setMedia] = useState<Media>();
  const navigate = useNavigate();
  const isMp4 = srcUrl?.endsWith(".mp4");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalNotMyMediaVisible, setModalNotMyMediaVisible] = useState(false);
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
    if (modalVisible && isFirstOpen) {
      fetchMediaDetail(data.id);
      setIsFirstOpen(false); // After fetch media, set false
    }
  }, [modalVisible, isFirstOpen]);

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
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setDeleteModalVisible(false);
  };

  const handleConfirm = async () => {
    try {
      const formValue = await form.validateFields();

      const updatedData: MediaFormValues = {
        id: media?.id,
        mediaOwner_id: tokenPayload.id,
        media_name: formValue.media_name,
        description: formValue.description,
        privacy: privacy ? "0" : "1",
        is_comment: isComment ? 1 : 0,
      };

      const response = await updatedMedia(data.id, updatedData);

      if (response) {
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Validation failed:", error);
      toast.error(
        "Validation failed: Please check the form fields and try again."
      );
    }
  };

  const deleteMedia = async () => {
    try {
      const response = await deleteMedias([data.id]);

      if (response) {
        handleCancel();
        toast.success("Media deleted successfully!");

        if (onDelete) {
          onDelete();
        }
      } else {
        toast.error("Failed to delete the Media. Please try again.");
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
                setModalVisible(true);
                e.stopPropagation(); // Prevent event propagation when the button is clicked
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
            className="absolute bottom-2 left-1/2 -translate-x-1/2 [&>div]:w-1 [&>div]:h-1"
          />
        )}
      </motion.div>

      {/* MODAL */}
      <ModalComponent
        title="Edit Your Media"
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        buttonLabels={{ confirmLabel: "Update", cancelLabel: "Cancel" }}
      >
        <Loading isLoading={loading} error={error}>
          <div className="detail_container">
            <div className="form_det">
              <Form form={form} layout="vertical">
                <FieldItem
                  label="Name"
                  name="media_name"
                  placeholder="Like 'Places to Go' or 'Recipes to Make'"
                >
                  <Input />
                </FieldItem>

                <FieldItem
                  label="Description"
                  name="description"
                  placeholder="Write a detailed description for your Media here."
                >
                  <Input />
                </FieldItem>

                <CheckboxWithDescription
                  title="Keep this media private"
                  description="So only you and collaborators can see it."
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.checked)}
                  name="privacy"
                />
                <CheckboxWithDescription
                  title="Allow people to comment"
                  value={isComment}
                  onChange={(e) => setIsComment(e.target.checked)}
                  name="is_comment"
                />
              </Form>
              <div className="delete-action" onClick={handleDeleteAction}>
                <p className="title-delele">Delete Media</p>
                <p className="des-delete">
                  You have 7 days to restore a deleted Media. After that, it
                  will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="media_detail">
              <Zoom>
                {media?.type === MEDIA_TYPES.VIDEO ? (
                  <video controls muted>
                    <source src={media?.media_url} type="video/mp4" />
                  </video>
                ) : (
                  <img src={media?.media_url} alt={media?.media_name} />
                )}
              </Zoom>
            </div>
          </div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        titleDefault="Delete this media?"
        visible={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setModalVisible(true);
        }}
        onConfirm={deleteMedia}
        buttonLabels={{ confirmLabel: "Delete", cancelLabel: "Cancel" }}
      >
        <div className="my-5">
          Are you sure you want to delete this Media? This action cannot be
          undone.
        </div>
      </ModalComponent>
    </>
  );
};

export default PinMedia;
