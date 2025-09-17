import React, { useEffect, useState } from "react";
import "./AlbumCard.less";
import { EditFilled, LockFilled } from "@ant-design/icons";
import { Album } from "type";
import { toast } from "react-toastify";
import { UpdateAlbumRequest } from "Album/AlbumRequest";
import { deleteMyAlbum, updateMyAlbum } from "@/api/album";
import { useNavigate } from "react-router";
import { EditAlbumModal, DeleteAlbumModal, InviteCollaboratorsModal } from "@/components/modal/album";

interface AlbumCardProps {
  album: Album;
  fetchAlbums: () => void; // Accept the fetchAlbums function as a prop
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, fetchAlbums }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleEditAlbum = async (albumRequest: UpdateAlbumRequest) => {
    try {
      const response = await updateMyAlbum(album.id, albumRequest);
      if (response) {
        setEditModalVisible(false);
        fetchAlbums();
        toast.success("Album updated successfully!");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update album. Please try again.");
    }
  };

  const handleDeleteAlbum = async () => {
    try {
      const response = await deleteMyAlbum(album.id);
      if (response) {
        setDeleteModalVisible(false);
        fetchAlbums();
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
                setEditModalVisible(true);
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

      {/* Edit Album Modal */}
      <EditAlbumModal
        visible={editModalVisible}
        album={album}
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
        album={album}
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
      />
    </>
  );
};

export default AlbumCard;
