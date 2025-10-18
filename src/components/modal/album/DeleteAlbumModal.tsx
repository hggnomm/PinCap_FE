import React from "react";
import ModalComponent from "@/components/modal/ModalComponent";
import { Album } from "type";

interface DeleteAlbumModalProps {
  visible: boolean;
  album: Album | null;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

const DeleteAlbumModal: React.FC<DeleteAlbumModalProps> = ({
  visible,
  album,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  return (
    <ModalComponent
      titleDefault="Delete this album?"
      visible={visible}
      onCancel={onCancel}
      onConfirm={onConfirm}
      buttonLabels={{ confirmLabel: "Delete", cancelLabel: "Cancel" }}
    >
      <div className="mb-5 mt-5">
        Are you sure you want to delete this album
        <p className="font-medium text-lg inline !mx-1">
          {album?.album_name}?
        </p>
        This action cannot be undone.
      </div>
    </ModalComponent>
  );
};

export default DeleteAlbumModal;
