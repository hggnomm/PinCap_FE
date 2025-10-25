import React from "react";

import ModalComponent from "@/components/modal/ModalComponent";
import { Media } from "@/types/type";

interface DeleteMediaModalProps {
  visible: boolean;
  media: Media | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteMediaModal: React.FC<DeleteMediaModalProps> = ({
  visible,
  media,
  onCancel,
  onConfirm,
}) => {
  return (
    <ModalComponent
      title="Delete Media"
      visible={visible}
      onCancel={onCancel}
      onConfirm={onConfirm}
      buttonLabels={{ confirmLabel: "Delete", cancelLabel: "Cancel" }}
      className="!w-[500px]"
    >
      <div className="delete-media-modal">
        <p className="text-base text-gray-700 mb-4">
          Are you sure you want to delete{" "}
          {media?.media_name ? (
            <span className="font-semibold">
              &quot;{media.media_name}&quot;
            </span>
          ) : (
            "this Media"
          )}
          ?
        </p>
        <p className="text-sm text-gray-500">
          This action cannot be undone. The media will be permanently deleted.
        </p>
      </div>
    </ModalComponent>
  );
};

export default DeleteMediaModal;
