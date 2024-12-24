import React, { useEffect, useState } from "react";
import "./AlbumCard.less";
import { EditFilled, LockFilled } from "@ant-design/icons";
import { Album } from "type";
import ModalComponent from "../../../../components/modal/ModalComponent";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import FieldItem from "../../../../components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "../../../../components/form/checkbox/CheckBoxComponent";

interface AlbumCardProps {
  album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  // MODAL COMPONENTS
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [privacy, setPrivacy] = useState(false);

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleConfirm = async () => {
    try {
      const formValues = await form.validateFields();
      // const albumRequest: CreateAlbumRequest = {
      //   album_name: formValues.album_name,
      //   privacy: privacy ? "0" : "1",
      // };

      // console.log("Album Request:", albumRequest);
      // setModalVisible(false);

      // const response = await createMyAlbum(albumRequest);

      // if (response) {
      //   fetchAlbums();
      //   setModalVisible(false);
      // }
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
      setPrivacy(false); // Reset privacy to false when opening the modal
    }
  }, [modalVisible, form]);

  return (
    <>
      <div className="album-card">
        <div className="img-container">
          {/* Dynamically render the image */}

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
              onClick={() => {
                setModalVisible(true);
              }}
            >
              <EditFilled />
            </div>

            {album.privacy == "PRIVATE" && (
              <div className="circle-button left-top">
                <LockFilled />
              </div>
            )}
          </div>
        </div>

        <div className="text-container">
          {/* Dynamically render album name and description */}
          <p className="album-title">{album.album_name}</p>
          <p className="album-description">{album.description}</p>
        </div>
      </div>

      {/* Modal để tạo album mới */}
      <ModalComponent
        title="Edit Your Album"
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        buttonLabels={{ confirmLabel: "Create", cancelLabel: "Cancel" }}
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
