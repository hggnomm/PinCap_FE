import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./index.less";
import { EditFilled } from "@ant-design/icons/lib";
import ModalComponent from "../../../components/modal/ModalComponent";
import { toast } from "react-toastify";
import { deleteMedias, getDetailMedia, updatedMedia } from "../../../api/media";
import { Media } from "type";
import { Form, Input } from "antd";
import FieldItem from "../../../components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "../../../components/form/checkbox/CheckBoxComponent";
import Loading from "../../../components/loading/Loading";
import { MediaFormValues } from "Media/MediaRequest";
import { useSelector } from "react-redux";

interface PinMediaProps {
  srcUrl: string;
  data: {
    id: string;
    media_url: string;
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
          media_name: detail?.media_name, // Set the album name in the form
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
        id: media?.id, // Sử dụng ID của media hiện tại
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
        className="box"
        onClick={() => navigate(`/media/${data?.id}`)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        style={{ position: "relative", overflow: "hidden" }}
      >
        {isMp4 ? (
          <video controls>
            <source src={srcUrl} type="video/mp4" />
          </video>
        ) : (
          <img src={srcUrl} alt="Media content" />
        )}
        <motion.div
          className="overlay"
          whileHover={{ opacity: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 3,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            opacity: 0,
            transition: "opacity 0.3s",
            zIndex: 1,
            borderRadius: "15px",
          }}
        >
          <div
            className="save-button right-top"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event propagation when the button is clicked
            }}
          >
            <p>Save</p>
          </div>
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
            <div className="img_detail">
              <img src={media?.media_url} alt={media?.media_name} />
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
        <div style={{ marginBottom: 20, marginTop: 20 }}>
          Are you sure you want to delete this Media? This action cannot be
          undone.
        </div>
      </ModalComponent>
    </>
  );
};

export default PinMedia;
