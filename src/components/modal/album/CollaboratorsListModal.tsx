import React from "react";
import { User, Crown, Edit, Eye } from "lucide-react";
import clsx from "clsx";
import ModalComponent from "@/components/modal/ModalComponent";
import { AlbumUser } from "@/types/type";
import { ALBUM_ROLES, ALBUM_INVITATION_STATUS } from "@/constants/constants";

interface CollaboratorsListModalProps {
  visible: boolean;
  onCancel: () => void;
  collaborators: AlbumUser[];
  loading?: boolean;
}

const CollaboratorsListModal: React.FC<CollaboratorsListModalProps> = ({
  visible,
  onCancel,
  collaborators,
  loading = false,
}) => {
  // Filter only accepted collaborators
  const acceptedCollaborators = collaborators.filter(
    collaborator => collaborator.status === ALBUM_INVITATION_STATUS.ACCEPTED
  );
  const getRoleIcon = (role: string) => {
    switch (role) {
      case ALBUM_ROLES.OWNER:
        return <Crown className="w-4 h-4 text-amber-600" />;
      case ALBUM_ROLES.EDIT:
        return <Edit className="w-4 h-4 text-blue-600" />;
      case ALBUM_ROLES.VIEW:
        return <Eye className="w-4 h-4 text-gray-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case ALBUM_ROLES.OWNER:
        return "Owner";
      case ALBUM_ROLES.EDIT:
        return "Editor";
      case ALBUM_ROLES.VIEW:
        return "Viewer";
      default:
        return "Unknown";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case ALBUM_ROLES.OWNER:
        return "bg-amber-100 text-amber-800";
      case ALBUM_ROLES.EDIT:
        return "bg-blue-100 text-blue-800";
      case ALBUM_ROLES.VIEW:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <ModalComponent
      titleDefault="Album Collaborators"
      className="!w-[600px]"
      visible={visible}
      onCancel={onCancel}
      showFooter={false}
    >
      <div className="p-5">
        {/* Header Info */}
        <div className="mb-6 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {acceptedCollaborators.length} Collaborator{acceptedCollaborators.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage who can view and edit this album
              </p>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
              <span className="ml-3 text-gray-600">Loading collaborators...</span>
            </div>
          ) : acceptedCollaborators.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No collaborators found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {acceptedCollaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center overflow-hidden">
                      {collaborator.avatar ? (
                        <img
                          src={collaborator.avatar}
                          alt={collaborator.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-rose-600" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{collaborator.name}</h4>
                        {getRoleIcon(collaborator.album_role)}
                      </div>
                      <p className="text-sm text-gray-500">{collaborator.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={clsx(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getRoleBadgeColor(collaborator.album_role)
                        )}>
                          {getRoleText(collaborator.album_role)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Followers Count */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {collaborator.followers_count} follower{collaborator.followers_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900">Role Permissions</h4>
              <div className="mt-2 space-y-1 text-xs text-blue-700">
                <div className="flex items-center space-x-2">
                  <Crown className="w-3 h-3" />
                  <span><strong>Owner:</strong> Full control, can manage collaborators</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Edit className="w-3 h-3" />
                  <span><strong>Editor:</strong> Can add, edit, and delete media</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-3 h-3" />
                  <span><strong>Viewer:</strong> Can only view album content</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default CollaboratorsListModal;
