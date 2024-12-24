// AlbumCard.tsx
import React, { useEffect, useState } from "react";
import "./AlbumCard.less";
import { EditFilled, LockFilled } from "@ant-design/icons";
import { Album } from "type";
import ModalComponent from "../../../../components/modal/ModalComponent";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import FieldItem from "../../../../components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "../../../../components/form/checkbox/CheckBoxComponent";
import { UpdateAlbumRequest } from "Album/AlbumRequest";
import { updateMyAlbum } from "../../../../api/album";
import { useNavigate } from "react-router";

interface AlbumCardProps {
  album: Album;
  fetchAlbums: () => void; // Accept the fetchAlbums function as a prop
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, fetchAlbums }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [privacy, setPrivacy] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleConfirm = async () => {
    try {
      const formValues = await form.validateFields();
      const albumRequest: UpdateAlbumRequest = {
        album_name: formValues.album_name,
        privacy: privacy ? "0" : "1",
      };

      console.log("Album Request:", albumRequest);
      setModalVisible(false);

      const response = await updateMyAlbum(album.id, albumRequest);

      if (response) {
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
          navigate(`/album/${album.id}`);
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
        </div>
      </ModalComponent>
    </>
  );
};

export default AlbumCard;
