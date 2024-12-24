import React, { useEffect, useState } from "react";
import "./MyAlbum.less";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons/lib";
import ButtonCircle from "../../../components/buttonCircle/ButtonCircle";
import { getAlbumData } from "../../../api/album";
import { Album } from "type";
import { useNavigate } from "react-router";
import ModalComponent from "../../../components/modal/ModalComponent";
import { Form, Input } from "antd";
import FieldItem from "../../../components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "../../../components/form/checkbox/CheckBoxComponent";
import { CreateAlbumRequest } from "Album/AlbumRequest";

const MyAlbum = () => {
  const [activeButton, setActiveButton] = useState("saved");
  const [albumData, setAlbumData] = useState<Album[]>([]);
  const [privacy, setPrivacy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    const response = await getAlbumData();
    if (response) {
      setAlbumData(response.data);
    }
  };

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  // MODAL COMPONENTS
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleConfirm = () => {
    const formValue = form.getFieldsValue(); 
    const privacyValue = privacy ? "1" : "0"; 

    const albumRequest: CreateAlbumRequest = {
      album_name: formValue.media_name, 
      privacy: privacyValue,
    };

    console.log(albumRequest);

    setModalVisible(false);
  };

  const handlePrivacyChange = (e: any) => {
    setPrivacy(e.target.checked);
  };

  return (
    <div className="album-container">
      <div className="fixed-topbar">
        <button
          className={activeButton === "created" ? "active" : ""}
          onClick={() => handleButtonClick("created")}
        >
          <p>Created</p>
        </button>
        <button
          className={activeButton === "saved" ? "active" : ""}
          onClick={() => handleButtonClick("saved")}
        >
          <p>Saved</p>
        </button>
      </div>
      <div className="my-list-media">
        <div className="action">
          <ButtonCircle
            paddingClass="padding-0-8"
            icon={
              <FilterOutlined
                style={{
                  fontSize: "26px",
                  strokeWidth: "30",
                  stroke: "black",
                }}
              />
            }
          />
          <ButtonCircle
            text="Create"
            paddingClass="padding-0-8"
            icon={
              <PlusOutlined
                style={{
                  fontSize: "26px",
                  strokeWidth: "40",
                  stroke: "black",
                }}
              />
            }
            dropdownMenu={[
              {
                key: "1",
                title: "Media",
                onClick: () => {
                  navigate("/create-media");
                },
              },
              {
                key: "2",
                title: "Album",
                onClick: () => {
                  setModalVisible(true);
                },
              },
            ]}
          />
        </div>
        <div className="list">
          {albumData.length > 0 ? (
            albumData.map((album: Album) => (
              <div key={album.id} className="album-item">
                <img
                  src={album.image_cover}
                  alt={album.image_cover}
                  className="album-cover"
                />
                <p className="album-title">{album.album_name}</p>
                <p className="album-description">{album.description}</p>
              </div>
            ))
          ) : (
            <p>No albums available.</p>
          )}
        </div>
      </div>

      {/* Modal để tạo album mới */}
      <ModalComponent
        title="Create New Album"
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        buttonLabels={{ confirmLabel: "Create", cancelLabel: "Cancel" }}
      >
        <div className="create-album">
          <Form form={form} layout="vertical">
            <Form.Item
              name="media_name"
              rules={[
                { required: true, message: "Please input the album title!" },
              ]}
            >
              <FieldItem
                label="Title"
                placeholder="Like 'Places to Go' or 'Recipes to Make'"
              >
                <Input />
              </FieldItem>
            </Form.Item>

            <Form.Item name="privacy" valuePropName="checked">
              <CheckboxWithDescription
                title="Keep this album private"
                description="So only you and collaborator can see it."
                value={privacy}
                onChange={handlePrivacyChange}
              />
            </Form.Item>
          </Form>
        </div>
      </ModalComponent>
    </div>
  );
};

export default MyAlbum;
