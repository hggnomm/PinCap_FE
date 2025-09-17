import React, { useEffect, useState } from "react";
import "./MyAlbum.less";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons/lib";
import ButtonCircle from "@/components/buttonCircle/ButtonCircle";
import { createMyAlbum, getMyAlbumData } from "@/api/album";
import { Album } from "type";
import { useNavigate } from "react-router";
import ModalComponent from "@/components/modal/ModalComponent";
import { Col, Form, Input, Row } from "antd";
import FieldItem from "@/components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "@/components/form/checkbox/CheckBoxComponent";
import { CreateAlbumRequest } from "Album/AlbumRequest";
import { toast } from "react-toastify";
import Loading from "@/components/loading/Loading";
import AlbumCard from "./AlbumCard/AlbumCard";

const MyAlbum = () => {
  const [activeButton, setActiveButton] = useState("created");
  const [albumData, setAlbumData] = useState<Album[]>([]);
  const [privacy, setPrivacy] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyAlbumData();
      if (response) {
        setAlbumData(response.data);
      }
    } catch (err) {
      setError("Failed to fetch albums. Please try again later.");
      toast.error("Failed to fetch albums. Please try again later.");
    } finally {
      setLoading(false);
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

  const handleConfirm = async () => {
    try {
      const formValues = await form.validateFields();
      const albumRequest: CreateAlbumRequest = {
        album_name: formValues.album_name,
        privacy: privacy ? "0" : "1",
      };

      console.log("Album Request:", albumRequest);
      setModalVisible(false);

      const response = await createMyAlbum(albumRequest);

      if (response) {
        fetchAlbums(); // Fetch the albums after creating a new one
        setModalVisible(false);
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
      setPrivacy(false); // Reset privacy to false when opening the modal
    }
  }, [modalVisible, form]);

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
            icon={<FilterOutlined style={{ fontSize: "26px" }} />}
          />
          <ButtonCircle
            text="Create"
            paddingClass="padding-0-8"
            icon={<PlusOutlined style={{ fontSize: "26px" }} />}
            dropdownMenu={[
              {
                key: "1",
                title: "Media",
                onClick: () => navigate("/create-media"),
              },
              {
                key: "2",
                title: "Album",
                onClick: () => setModalVisible(true),
              },
            ]}
          />
        </div>
        <Loading isLoading={loading} error={error}>
          <div style={{ padding: "12px" }}>
            <Row gutter={[24, 70]}>
              {albumData.length > 0 &&
                albumData.map((album: Album) => (
                  <Col key={album.id} xs={24} sm={12} md={8} lg={8} xl={6}>
                    <AlbumCard album={album} fetchAlbums={fetchAlbums} />
                  </Col>
                ))}
            </Row>
          </div>
        </Loading>
      </div>

      {/* Modal để tạo album mới */}
      <ModalComponent
        title="Create New Album"
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        buttonLabels={{ confirmLabel: "Create", cancelLabel: "Cancel" }}
        className="!w-[600px]"
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
    </div>
  );
};

export default MyAlbum;
