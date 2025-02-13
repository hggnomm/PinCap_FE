import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./index.less";
import { EditFilled } from "@ant-design/icons/lib";
import ModalComponent from "../../../components/modal/ModalComponent";
import { toast } from "react-toastify";
import { deleteMedias } from "../../../api/media";

interface PinMediaProps {
  srcUrl: string;
  data: {
    id: string;
    media_url: string;
  };
  isEditMedia?: boolean;
}

const PinMedia: React.FC<PinMediaProps> = (props) => {
  const navigate = useNavigate();
  const { srcUrl, data, isEditMedia } = props;
  const isMp4 = srcUrl?.endsWith(".mp4");

  const [modalVisible, setModalVisible] = useState(false); // Modal chính
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Modal confirm delete

  const handleDeleteAction = () => {
    setDeleteModalVisible(true); // Mở modal xác nhận xóa
    setModalVisible(false); // Ẩn modal chính
  };

  const handleCancel = () => {
    setModalVisible(false);
    setDeleteModalVisible(false); // Đảm bảo khi đóng modal confirm delete, modal chính vẫn có thể mở
  };

  const handleConfirm = async () => {
    try {
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
        // Fetch lại data
        toast.success("Media deleted successfully!"); // Hiển thị thông báo thành công
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
        title="Edit This Media"
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        buttonLabels={{ confirmLabel: "Update", cancelLabel: "Cancel" }}
      >
        <div className="delete-action" onClick={handleDeleteAction}>
          <p className="title-delelte">Delete Media</p>
          <p className="des-delete">
            You have 7 days to restore a deleted Media. After that, it will be
            permanently deleted.
          </p>
        </div>
      </ModalComponent>

      {/* Modal xác nhận xóa Media */}
      <ModalComponent
        titleDefault="Delete this media?"
        visible={deleteModalVisible}
        onCancel={handleCancel}
        onConfirm={deleteMedia}
        buttonLabels={{ confirmLabel: "Delete", cancelLabel: "Cancel" }}
      >
        <div
          style={{
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          Are you sure you want to delete this Media
          <p
            style={{
              fontWeight: 500,
              fontSize: "1.1em",
              display: "inline",
              marginRight: "5px",
              marginLeft: "5px",
            }}
          >
            Media Name...
          </p>
          This action cannot be undone.
        </div>
      </ModalComponent>
    </>
  );
};

export default PinMedia;
