import React, { useEffect, useState } from "react";
import "./DetailAlbum.less";
import { useLocation, useNavigate } from "react-router";
import MediaList from "@/components/viewPin/ViewPinComponent";
import {
  deleteMyAlbum,
  getDetailAlbum,
  updateMyAlbum,
} from "@/api/album";
import { Album } from "type";
import { toast } from "react-toastify";
import ButtonCircle from "@/components/buttonCircle/ButtonCircle";
import { LockFilled, MoreOutlined } from "@ant-design/icons/lib";
import { UpdateAlbumRequest } from "@/types/Album/AlbumRequest";
import Loading from "@/components/loading/Loading";
import CollaboratorsSection from "@/components/collaborators/CollaboratorsSection";
import { EditAlbumModal, DeleteAlbumModal, InviteCollaboratorsModal } from "@/components/modal/album";
import Empty, { NoMediaIcon } from "@/components/Empty";

const DetailAlbum = () => {
  const location = useLocation();
  const albumId = location.state?.albumId;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [albumData, setAlbumData] = useState<Album | null>(null);
  const [isFetchData, setIsFetchData] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (albumId) {
      fetchDetailAlbums();
    } else {
      setError("Album ID is missing.");
      toast.error("Album ID is missing.");
    }
  }, []);


  const fetchDetailAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDetailAlbum(albumId);
      console.log(response);
      if (response) {
        setAlbumData(response);
        setIsFetchData(true);
      }
    } catch (err) {
      setError("Failed to fetch albums. Please try again later.");
      toast.error("Failed to fetch albums. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAlbum = async (albumRequest: UpdateAlbumRequest) => {
    try {
      const response = await updateMyAlbum(albumId, albumRequest);
      if (response) {
        setEditModalVisible(false);
        fetchDetailAlbums();
        toast.success("Album updated successfully!");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update album. Please try again.");
    }
  };

  const handleDeleteAlbum = async () => {
    try {
      const response = await deleteMyAlbum(albumId);
      if (response) {
        setDeleteModalVisible(false);
        navigate("/album");
        toast.success("Album deleted successfully!");
      } else {
        toast.error("Failed to delete the album. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error("An error occurred while deleting the album. Please try again.");
    }
  };

  const handleInviteCollaborators = () => {
    setInviteModalVisible(false);
    toast.info("Invite functionality will be implemented later");
  };
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

        {isFetchData && albumData?.medias && albumData.medias.length > 0 && (
          <MediaList medias={albumData?.medias} isEditMedia />
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
      </div>
    </Loading>
  );
};

export default DetailAlbum;
