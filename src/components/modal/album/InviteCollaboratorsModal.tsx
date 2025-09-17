import React from "react";
import ModalComponent from "@/components/modal/ModalComponent";

interface InviteCollaboratorsModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const InviteCollaboratorsModal: React.FC<InviteCollaboratorsModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  return (
    <ModalComponent
      titleDefault="Invite Collaborators"
      visible={visible}
      onCancel={onCancel}
      onConfirm={onConfirm}
      buttonLabels={{ confirmLabel: "Send Invite", cancelLabel: "Cancel" }}
    >
      <div className="p-5">
        <p className="mb-3">This feature will be implemented to invite collaborators to the album.</p>
        <p>Users will be able to search and invite other users to collaborate on this album.</p>
        
        {/* TODO: Add search functionality, user list, etc. */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-700 mb-2">Coming Soon:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Search users by name or email</li>
            <li>• Select multiple users to invite</li>
            <li>• Set collaboration permissions</li>
            <li>• Send invitation notifications</li>
          </ul>
        </div>
      </div>
    </ModalComponent>
  );
};

export default InviteCollaboratorsModal;
