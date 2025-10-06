import React, { useState } from "react";
import "./MyAlbum.less";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons/lib";
import ButtonCircle from "@/components/buttonCircle/ButtonCircle";
import { Album } from "type";
import { useNavigate } from "react-router";
import CreateAlbumModal from "@/components/modal/album/CreateAlbumModal";
import { Col, Row } from "antd";
import { toast } from "react-toastify";
import Loading from "@/components/loading/Loading";
import AlbumCard from "./AlbumCard/AlbumCard";
import { useAlbum } from "@/hooks/useAlbum";

const MyAlbum = () => {
  const navigate = useNavigate();
  const { getAlbumList, createAlbum, createAlbumLoading } = useAlbum();

  const { data: albumsData, isLoading, error, refetch } = getAlbumList();

  // MODAL COMPONENTS
  const [modalVisible, setModalVisible] = useState(false);

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleConfirm = async (data: {
    album_name: string;
    privacy: string;
  }) => {
    try {
      const albumRequest = {
        album_name: data.album_name,
        privacy: data.privacy as "0" | "1",
      };

      await createAlbum(albumRequest);
      setModalVisible(false);
      toast.success("Album created successfully!");
    } catch (error) {
      console.error("Create album failed:", error);
      toast.error("Failed to create album. Please try again.");
    }
  };

  const renderAlbumSection = (
    sectionTitle: string,
    albumsList: Album[]
  ) => (
    <div className="album-section pt-2 pb-[40px] border-b-3 last:border-b-0 border-[#9eb8d9] px-[20px]">
      <h2 className="!pl-2 text-xl font-bold !mb-2 text-gray-800">
        {sectionTitle}
      </h2>
      <div className="p-3">
        <Row gutter={[24, 70]}>
          {albumsList?.map((album: Album) => (
            <Col key={album.id} xs={24} sm={12} md={8} lg={8} xl={6}>
              <AlbumCard album={album} fetchAlbums={refetch} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );

  return (
    <div className="album-container">
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

        <Loading 
          isLoading={isLoading} 
          error={error ? "Failed to fetch albums. Please try again later." : null}
        >
          {albumsData?.data && renderAlbumSection("My Albums", albumsData.data)}
        </Loading>
      </div>

      <CreateAlbumModal
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        loading={createAlbumLoading}
      />
    </div>
  );
};

export default MyAlbum;
