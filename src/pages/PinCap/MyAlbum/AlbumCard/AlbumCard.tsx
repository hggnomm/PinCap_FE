import React, { useEffect, useState } from "react";
import "./AlbumCard.less";
import { EditFilled, LockFilled } from "@ant-design/icons";
import { Album } from "type";
import ModalComponent from "@/components/modal/ModalComponent";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import FieldItem from "@/components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "@/components/form/checkbox/CheckBoxComponent";
import { UpdateAlbumRequest } from "Album/AlbumRequest";
import { deleteMyAlbum, updateMyAlbum } from "@/api/album";
import { useNavigate } from "react-router";

interface AlbumCardProps {
  album: Album;
  fetchAlbums: () => void; // Accept the fetchAlbums function as a prop
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, fetchAlbums }) => {
  const [modalVisible, setModalVisible] = useState(false); // Modal chính
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Modal confirm delete
  const [form] = Form.useForm<Album>();
  const [privacy, setPrivacy] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => {
    setModalVisible(false);
    setDeleteModalVisible(false);
  };

  const handleConfirm = async () => {
    try {
      const formValues = await form.validateFields();
      const albumRequest: UpdateAlbumRequest = {
        album_name: formValues.album_name,
        privacy: privacy ? "0" : "1",
      };

      console.log("Album Request:", albumRequest);

      const response = await updateMyAlbum(album.id, albumRequest);

      if (response) {
        setModalVisible(false);
        fetchAlbums(); // Call fetchAlbums to refresh the album list
      }
    } catch (error) {
      console.error("Validation failed:", error);
      toast.error(
        "Validation failed: Please check the form fields and try again."
      );
    }
  };

  const handlePrivacyChange = (e: any) => {
    setPrivacy(e.target.checked);
  };

  const handleDeleteAction = () => {
    setDeleteModalVisible(true); // Mở modal xác nhận xóa
    setModalVisible(false); // Ẩn modal chính
  };

  const deleteAlbum = async () => {
    try {
      const response = await deleteMyAlbum(album.id);

      if (response) {
        handleCancel();
        fetchAlbums();
        toast.success("Album deleted successfully!"); // Hiển thị thông báo thành công
      } else {
        toast.error("Failed to delete the album. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error(
        "An error occurred while deleting the album. Please try again."
      );
    }
  };

  useEffect(() => {
    if (modalVisible) {
      form.resetFields(); // Reset form fields each time the modal is opened
      setPrivacy(album.privacy === "PRIVATE"); // Set privacy based on album's current privacy status

      form.setFieldsValue({
        album_name: album.album_name, // Set the album name in the form
      });
    }
  }, [modalVisible, album, form]);

  return (
    <>
      <div
        className="album-card"
        onClick={() => {
          navigate(`/album/${album.id}`, { state: { albumId: album.id } });
        }}
      >
        <div className="img-container">
          {album.image_cover && (
            <img
              src={album.image_cover}
              alt="Album preview"
              className="album-cover"
            />
          )}
          <div className="overlay">
            <div
              className="circle-button right-bottom"
              onClick={(e) => {
                e.stopPropagation(); // Ngừng sự kiện click của phần tử cha khi nhấn vào button
                setModalVisible(true);
              }}
            >
              <EditFilled />
            </div>

            {album.privacy === "PRIVATE" && (
              <div className="circle-button left-top">
                <LockFilled />
              </div>
            )}
          </div>
        </div>

        <div className="text-container">
          <p className="album-title">{album.album_name}</p>
          <p className="album-description">{album.description}</p>
        </div>
      </div>

      {/* Modal chính - Edit Your Album */}
      <ModalComponent
        title="Edit Your Album"
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        buttonLabels={{ confirmLabel: "Update", cancelLabel: "Cancel" }}
      >
        <div className="create-album">
          <Form form={form} layout="vertical">
            <FieldItem
              label="Name"
              name="album_name"
              rules={[
                { required: true, message: "Please input the album title!" },
              ]}
              placeholder="Like 'Places to Go' or 'Recipes to Make'"
            >
              <Input />
            </FieldItem>

            <CheckboxWithDescription
              title="Keep this album private"
              description="So only you and collaborator can see it."
              value={privacy}
              onChange={handlePrivacyChange}
              name="privacy"
            />
          </Form>

          {/* Phần xóa album */}
          <div className="delete-action" onClick={handleDeleteAction}>
            <p className="title-delele">Delete album</p>
            <p className="des-delete">
              You have 7 days to restore a deleted Album. After that, it will be
              permanently deleted.
            </p>
          </div>
        </div>
      </ModalComponent>

      {/* Modal xác nhận xóa album */}
      <ModalComponent
        titleDefault="Delete this album?"
        visible={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false);
          setModalVisible(true);
        }}
        onConfirm={deleteAlbum}
        buttonLabels={{ confirmLabel: "Delete", cancelLabel: "Cancel" }}
      >
        <div
          style={{
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          Are you sure you want to delete this album
          <p
            style={{
              fontWeight: 500,
              fontSize: "1.1em",
              display: "inline",
              marginRight: "5px",
              marginLeft: "5px",
            }}
          >
            {album.album_name}?
          </p>
          This action cannot be undone.
        </div>
      </ModalComponent>
    </>
  );
};

export default AlbumCard;
