import { useState, Suspense, lazy } from "react";

import "./MyAlbum.less";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { FilterOutlined, PlusOutlined } from "@ant-design/icons/lib";

import { Col, Row } from "antd";

import ButtonCircle from "@/components/ButtonCircle/ButtonCircle";
import Loading from "@/components/Loading/Loading";
import { InfoTooltip } from "@/components/Tooltip";
import { ROUTES } from "@/constants/routes";
import { useAlbum } from "@/react-query/useAlbum";
import { TokenPayload } from "@/types/Auth";

import { Album } from "type";

import AlbumCard from "./AlbumCard/AlbumCard";

const CreateAlbumModal = lazy(
  () => import("@/components/Modal/album/CreateAlbumModal")
);
const MyAlbum = () => {
  const navigate = useNavigate();
  const tokenPayload = useSelector(
    (state: { auth: TokenPayload }) => state.auth
  );
  const { getAlbumList, getAlbumMemberList, createAlbum, createAlbumLoading } =
    useAlbum();

  const { data: albumsData, isLoading } = getAlbumList();
  const { data: memberAlbumsData, isLoading: isMemberLoading } =
    getAlbumMemberList();

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

  const renderAlbumSection = (sectionTitle: string, albumsList: Album[]) => (
    <div className="album-section pt-2 border-b-3 last:border-b-0 border-[#9eb8d9] px-[20px]">
      <h2 className="pl-2 text-xl font-bold !my-2 text-gray-800 flex items-center">
        {sectionTitle}
        {sectionTitle === "Albums Shared with Me" && (
          <InfoTooltip
            title="These are albums that you have been invited to as a member. You can view and contribute to these albums."
            placement="top"
          />
        )}
      </h2>
      <div className="p-3">
        <Row gutter={[24, 12]}>
          {albumsList?.map((album: Album) => (
            <Col key={album.id} xs={24} sm={12} md={8} lg={8} xl={6}>
              <AlbumCard
                album={album}
                currentUserId={tokenPayload.id}
                isMyAlbum={sectionTitle === "My Albums"}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );

  return (
    <Loading isLoading={isLoading || isMemberLoading}>
      <div className="album-container">
        <div className="my-list-media">
          <div className="action sticky top-0 !z-20 bg-white !pb-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
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
                  onClick: () => navigate(ROUTES.CREATE_MEDIA),
                },
                {
                  key: "2",
                  title: "Album",
                  onClick: () => setModalVisible(true),
                },
              ]}
            />
          </div>

          <div className="flex-1">
            {albumsData?.data &&
              renderAlbumSection("My Albums", albumsData.data)}
            {memberAlbumsData?.data &&
              renderAlbumSection(
                "Albums Shared with Me",
                memberAlbumsData.data
              )}
          </div>
        </div>

        <Suspense fallback={<></>}>
          <CreateAlbumModal
            visible={modalVisible}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            loading={createAlbumLoading}
          />
        </Suspense>
      </div>
    </Loading>
  );
};

export default MyAlbum;
