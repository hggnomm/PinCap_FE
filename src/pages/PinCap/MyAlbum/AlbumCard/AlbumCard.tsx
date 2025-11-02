import React, { useState } from "react";

import "./AlbumCard.less";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { EditFilled, LockFilled } from "@ant-design/icons";

import {
  EditAlbumModal,
  DeleteAlbumModal,
  InviteCollaboratorsModal,
} from "@/components/Modal/album";
import { ROUTES } from "@/constants/routes";
import { useAlbum } from "@/react-query/useAlbum";
import { Album } from "@/types/type";
import { isAlbumOwner } from "@/utils/utils";
import { UpdateAlbumFormData } from "@/validation/album";

interface AlbumCardProps {
  album: Album;
  currentUserId: string; // Current user ID to check permissions
  isMyAlbum?: boolean; // Whether this is from "My Albums" (always owner) or "Shared Albums"
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  currentUserId,
  isMyAlbum = false,
}) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const navigate = useNavigate();
  const { updateAlbum, updateAlbumLoading, deleteAlbum } = useAlbum();

  const isOwner = isMyAlbum || isAlbumOwner(album, currentUserId);

  const handleEditAlbum = async (albumRequest: UpdateAlbumFormData) => {
    try {
      await updateAlbum({
        id: album.id,
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
      await deleteAlbum(album.id);
      setDeleteModalVisible(false);
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

  return (
    <>
      <div
        className="album-card"
        onClick={() => {
          navigate(ROUTES.ALBUM_DETAIL.replace(":id", album.id), {
            state: { albumId: album.id },
          });
        }}
      >
        <div className="img-container">
          {album.image_cover && (
            <div className="flex items-center justify-center w-full h-full">
              <img
                src={album.image_cover}
                alt="Album preview"
                className="max-h-full max-w-full rounded-[15px]"
              />
            </div>
          )}
          <div className="overlay">
            {isOwner && (
              <div
                className="circle-button right-bottom"
                onClick={(e) => {
                  e.stopPropagation(); // Ngừng sự kiện click của phần tử cha khi nhấn vào button
                  setEditModalVisible(true);
                }}
              >
                <EditFilled />
              </div>
            )}

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
        loading={updateAlbumLoading}
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
        albumId={album.id}
      />
    </>
  );
};

export default AlbumCard;
