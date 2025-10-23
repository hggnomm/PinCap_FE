import { useEffect, useState } from "react";

import "./DetailAlbum.less";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

import { LockFilled, MoreOutlined } from "@ant-design/icons/lib";

import ButtonCircle from "@/components/buttonCircle/ButtonCircle";
import CollaboratorsSection from "@/components/collaborators/CollaboratorsSection";
import Empty, { NoMediaIcon } from "@/components/Empty";
import Loading from "@/components/loading/Loading";
import {
  EditAlbumModal,
  DeleteAlbumModal,
  InviteCollaboratorsModal,
  CollaboratorsListModal,
} from "@/components/modal/album";
import MediaList from "@/components/viewPin/ViewPinComponent";
import { ROUTES } from "@/constants/routes";
import { useAlbum } from "@/react-query/useAlbum";
import { UpdateAlbumFormData } from "@/validation/album";

const DetailAlbum = () => {
  const location = useLocation();
  const albumId = location.state?.albumId;
  const navigate = useNavigate();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [collaboratorsListModalVisible, setCollaboratorsListModalVisible] =
    useState(false);

  // Use React Query hooks
  const { getAlbumById, updateAlbum, deleteAlbum } = useAlbum();
  const {
    data: albumData,
    isLoading: loading,
    error: queryError,
  } = getAlbumById(albumId);

  useEffect(() => {
    if (!albumId) {
      toast.error("Album ID is missing.");
      navigate(ROUTES.MY_ALBUM);
    }
  }, [albumId, navigate]);

  const handleEditAlbum = async (albumRequest: UpdateAlbumFormData) => {
    try {
      await updateAlbum({
        id: albumId,
        data: albumRequest,
      });
      setEditModalVisible(false);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update album. Please try again.");
    }
  };

  const handleDeleteAlbum = async () => {
    try {
      await deleteAlbum(albumId);
      setDeleteModalVisible(false);
      navigate(ROUTES.MY_ALBUM);
      toast.success("Album deleted successfully!");
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error(
        "An error occurred while deleting the album. Please try again."
      );
    }
  };

  const handleInviteCollaborators = () => {
    setInviteModalVisible(false);
    toast.info("Invite functionality will be implemented later");
  };
  const error = queryError
    ? "Failed to fetch album. Please try again later."
    : null;

  return (
    <Loading isLoading={loading} error={error}>
      <div className="album-detail-container">
        <div className="top-container">
          <div className="detail">
            <p className="album_name">{albumData?.album_name}</p>

            {albumData?.privacy === "PRIVATE" && (
              <div className="private">
                <LockFilled />
                <p>Private</p>
              </div>
            )}

            {albumData?.description && (
              <p className="album_description">{albumData?.description}</p>
            )}

            <CollaboratorsSection
              collaborators={albumData?.allUser || []}
              onAddCollaborator={() => setInviteModalVisible(true)}
              onViewAllCollaborators={() =>
                setCollaboratorsListModalVisible(true)
              }
            />
          </div>
          <div>
            <ButtonCircle
              text="Create"
              paddingClass="padding-0-8"
              icon={
                <MoreOutlined
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
                  title: "Edit Album",
                  onClick: () => {
                    setEditModalVisible(true);
                  },
                },
              ]}
            />
          </div>
        </div>
        {albumData?.medias && albumData.medias.length === 0 && (
          <Empty
            icon={<NoMediaIcon />}
            title="No Media Yet"
            description="There aren't any medias on this album yet. Start adding some!"
          />
        )}

        {albumData?.medias && albumData.medias.length > 0 && (
          <MediaList
            medias={albumData?.medias}
            isEditMedia
            isSaveMedia={false}
            albumContext={{
              inAlbum: true,
              albumId: albumId,
              onRemoved: () => {
                /* refetch handled by useAlbum invalidate */
              },
            }}
          />
        )}

        {/* Edit Album Modal */}
        <EditAlbumModal
          visible={editModalVisible}
          album={albumData}
          onCancel={() => setEditModalVisible(false)}
          onConfirm={handleEditAlbum}
          onDeleteClick={() => {
            setEditModalVisible(false);
            setDeleteModalVisible(true);
          }}
          onInviteCollaborators={() => {
            setEditModalVisible(false);
            setInviteModalVisible(true);
          }}
        />

        {/* Delete Album Modal */}
        <DeleteAlbumModal
          visible={deleteModalVisible}
          album={albumData}
          onCancel={() => {
            setDeleteModalVisible(false);
            setEditModalVisible(true);
          }}
          onConfirm={handleDeleteAlbum}
        />

        {/* Invite Collaborators Modal */}
        <InviteCollaboratorsModal
          visible={inviteModalVisible}
          onCancel={() => setInviteModalVisible(false)}
          onConfirm={handleInviteCollaborators}
          albumId={albumId}
        />

        {/* Collaborators List Modal */}
        <CollaboratorsListModal
          visible={collaboratorsListModalVisible}
          onCancel={() => setCollaboratorsListModalVisible(false)}
          albumId={albumId}
        />
      </div>
    </Loading>
  );
};

export default DetailAlbum;
