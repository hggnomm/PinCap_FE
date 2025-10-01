import React, { useEffect, useState } from "react";
import "./MyAlbum.less";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons/lib";
import ButtonCircle from "@/components/buttonCircle/ButtonCircle";
import { createMyAlbum, getMyAlbumData } from "@/api/album";
import { Album } from "type";
import { useNavigate } from "react-router";
import CreateAlbumModal from "@/components/modal/album/CreateAlbumModal";
import { Col, Row } from "antd";
import { toast } from "react-toastify";
import Loading from "@/components/loading/Loading";
import AlbumCard from "./AlbumCard/AlbumCard";

const MyAlbum = () => {
  const [activeButton, setActiveButton] = useState("created");
  const [albumData, setAlbumData] = useState<Album[]>([]);
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
  const [createLoading, setCreateLoading] = useState(false);

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleConfirm = async (data: { 
    album_name: string; 
    privacy: string; 
  }) => {
    setCreateLoading(true);
    try {
      const albumRequest = {
        album_name: data.album_name,
        privacy: data.privacy,
      };

      console.log("Album Request:", albumRequest);

      const response = await createMyAlbum(albumRequest);

      if (response) {
        fetchAlbums(); // Fetch the albums after creating a new one
        setModalVisible(false);
        toast.success("Album created successfully!");
      }
    } catch (error) {
      console.error("Create album failed:", error);
      toast.error("Failed to create album. Please try again.");
    } finally {
      setCreateLoading(false);
    }
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

      <CreateAlbumModal
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        loading={createLoading}
      />
    </div>
  );
};

export default MyAlbum;
