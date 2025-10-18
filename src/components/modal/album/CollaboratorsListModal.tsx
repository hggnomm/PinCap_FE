import React, { useCallback, useState } from "react";
import { User, Crown, Edit, Eye, ChevronsUpDown, Trash2 } from "lucide-react";
import clsx from "clsx";
import ModalComponent from "@/components/modal/ModalComponent";
import { AlbumUser } from "@/types/type";
import { ALBUM_ROLES, ALBUM_INVITATION_STATUS } from "@/constants/constants";
import { Dropdown } from "@/components/dropdown";
import Empty from "@/components/Empty";
import { useAlbum } from "@/react-query/useAlbum";
import { toast } from "react-toastify";
import type { MenuProps } from "antd";

interface CollaboratorsListModalProps {
  visible: boolean;
  onCancel: () => void;
  albumId: string;
}

const CollaboratorsListModal: React.FC<CollaboratorsListModalProps> = ({
  visible,
  onCancel,
  albumId,
}) => {
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] =
    useState<AlbumUser | null>(null);

  // Use React Query hooks
  const { getUsersInAlbum, updateMemberRole, removeMemberFromAlbum } = useAlbum();
  const { data: collaboratorsData, isLoading: loading, error } = getUsersInAlbum(albumId, {
    per_page: 50, // Get more collaborators
    page: 1,
  });

  // Filter only accepted collaborators and sort with Owner first
  const acceptedCollaborators = (collaboratorsData?.data || [])
    .filter(
      (collaborator: AlbumUser) => collaborator.status === ALBUM_INVITATION_STATUS.ACCEPTED
    )
    .sort((a: AlbumUser, b: AlbumUser) => {
      // Owner always comes first
      if (a.album_role === ALBUM_ROLES.OWNER) return -1;
      if (b.album_role === ALBUM_ROLES.OWNER) return 1;

      // Then sort by role priority: Editor, then Viewer
      const rolePriority = {
        [ALBUM_ROLES.EDIT]: 1,
        [ALBUM_ROLES.VIEW]: 2,
      };

      const aPriority =
        rolePriority[a.album_role as keyof typeof rolePriority] || 999;
      const bPriority =
        rolePriority[b.album_role as keyof typeof rolePriority] || 999;

      return aPriority - bPriority;
    });
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

  const handleRoleChange = useCallback(
    async (collaboratorId: string, newRole: string) => {
      try {
        await updateMemberRole({
          albumId,
          userId: collaboratorId,
          data: { role: newRole as "VIEW" | "EDIT" }
        });
        toast.success("Role updated successfully!");
      } catch (error) {
        console.error("Failed to update role:", error);
        toast.error("Failed to update role. Please try again.");
      }
    },
    [albumId, updateMemberRole]
  );

  const handleRemoveCollaborator = useCallback((collaborator: AlbumUser) => {
    setSelectedCollaborator(collaborator);
    setRemoveModalVisible(true);
  }, []);

  const handleRemoveConfirm = useCallback(async () => {
    if (selectedCollaborator) {
      try {
        await removeMemberFromAlbum({
          albumId,
          userId: selectedCollaborator.id
        });
        toast.success("Member removed successfully!");
        setRemoveModalVisible(false);
        setSelectedCollaborator(null);
      } catch (error) {
        console.error("Failed to remove member:", error);
        toast.error("Failed to remove member. Please try again.");
      }
    }
  }, [selectedCollaborator, albumId, removeMemberFromAlbum]);

  const handleRemoveCancel = useCallback(() => {
    setRemoveModalVisible(false);
    setSelectedCollaborator(null);
  }, []);

  const getRoleMenuItems = useCallback(
    (collaborator: AlbumUser): MenuProps["items"] => {
      // Owner role cannot be changed
      if (collaborator.album_role === ALBUM_ROLES.OWNER) {
        return [
          {
            key: ALBUM_ROLES.OWNER,
            label: (
              <div className="flex items-center space-x-2">
                {getRoleIcon(ALBUM_ROLES.OWNER)}
                <span>{getRoleText(ALBUM_ROLES.OWNER)}</span>
              </div>
            ),
            disabled: true,
          },
        ];
      }

      return [
        {
          key: ALBUM_ROLES.EDIT,
          label: (
            <div className="flex items-center space-x-2">
              {getRoleIcon(ALBUM_ROLES.EDIT)}
              <span>{getRoleText(ALBUM_ROLES.EDIT)}</span>
            </div>
          ),
          onClick: () => handleRoleChange(collaborator.id, ALBUM_ROLES.EDIT),
        },
        {
          key: ALBUM_ROLES.VIEW,
          label: (
            <div className="flex items-center space-x-2">
              {getRoleIcon(ALBUM_ROLES.VIEW)}
              <span>{getRoleText(ALBUM_ROLES.VIEW)}</span>
            </div>
          ),
          onClick: () => handleRoleChange(collaborator.id, ALBUM_ROLES.VIEW),
        },
        {
          type: "divider",
        },
        {
          key: "DELETE",
          label: (
            <div className="flex items-center space-x-2 text-red-600">
              <Trash2 className="w-4 h-4" />
              <span>Remove</span>
            </div>
          ),
          onClick: () => handleRemoveCollaborator(collaborator),
        },
      ];
    },
    [handleRoleChange, handleRemoveCollaborator]
  );

  const renderOwnerRole = useCallback((collaborator: AlbumUser) => {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-semibold text-amber-800">
          {getRoleText(collaborator.album_role)}
        </span>
      </div>
    );
  }, []);

  const renderMemberRole = useCallback(
    (collaborator: AlbumUser) => {
      return (
         <div className="cursor-pointer">
           <Dropdown
             items={getRoleMenuItems(collaborator)}
             placement="bottomRight"
             buttonProps={{
               type: "default",
               size: "large",
               className: "min-w-[140px] h-12",
             }}
             showArrow={true}
             dropdownStyle={{ minWidth: "180px" }}
             overlayClassName="py-2"
           >
            <div className="flex items-center justify-center space-x-2 w-full">
              <span
                className={clsx(
                  "text-sm font-medium",
                  collaborator.album_role === ALBUM_ROLES.EDIT
                    ? "text-blue-700"
                    : "text-gray-700"
                )}
              >
                {getRoleText(collaborator.album_role)}
              </span>
              <ChevronsUpDown className="size-4 text-gray-400" />
            </div>
          </Dropdown>
        </div>
      );
    },
    [getRoleMenuItems]
  );

  const renderCollaboratorItem = useCallback(
    (collaborator: AlbumUser) => {
      return (
        <div
          key={collaborator.id}
          className={clsx(
            "flex items-center justify-between p-4 border rounded-lg transition-colors",
            collaborator.album_role === ALBUM_ROLES.OWNER
              ? "border-amber-200 bg-gradient-to-r from-amber-25 to-amber-50 hover:from-amber-50 hover:to-amber-100"
              : "border-gray-200 hover:bg-gray-50"
          )}
        >
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center overflow-hidden">
              {collaborator.avatar && (
                <img
                  src={collaborator.avatar}
                  alt={collaborator.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              {!collaborator.avatar && (
                <User className="w-6 h-6 text-rose-600" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center !space-x-2 mb-1">
                <h4 className="font-medium text-gray-900">
                  {collaborator.name}
                </h4>
                {getRoleIcon(collaborator.album_role)}
              </div>
              <p className="text-sm text-gray-500">{collaborator.email}</p>
            </div>
          </div>

          {/* Role Display */}
          <div className="flex-shrink-0">
            {collaborator.album_role === ALBUM_ROLES.OWNER &&
              renderOwnerRole(collaborator)}
            {collaborator.album_role !== ALBUM_ROLES.OWNER &&
              renderMemberRole(collaborator)}
          </div>
        </div>
      );
    },
    [renderOwnerRole, renderMemberRole]
  );

  const renderRemoveMemberModal = useCallback(() => {
    if (!selectedCollaborator) return null;

    return (
      <ModalComponent
        title="Remove Collaborator"
        visible={removeModalVisible}
        onCancel={handleRemoveCancel}
        onConfirm={handleRemoveConfirm}
        buttonLabels={{
          confirmLabel: "Remove",
          cancelLabel: "Cancel",
        }}
        className="!w-[500px]"
      >
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center overflow-hidden">
              {selectedCollaborator.avatar ? (
                <img
                  src={selectedCollaborator.avatar}
                  alt={selectedCollaborator.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-rose-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCollaborator.name}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedCollaborator.email}
              </p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-900">
                  Remove from Album
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  This will remove {selectedCollaborator.name} from the album.
                  They will no longer be able to access or contribute to this
                  album.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ModalComponent>
    );
  }, [
    selectedCollaborator,
    removeModalVisible,
    handleRemoveCancel,
    handleRemoveConfirm,
  ]);

  return (
    <>
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
                  {acceptedCollaborators.length} Collaborator
                  {acceptedCollaborators.length !== 1 ? "s" : ""}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage who can view and edit this album
                </p>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                <span className="ml-3 text-gray-600">
                  Loading collaborators...
                </span>
              </div>
            )}

            {!loading && acceptedCollaborators.length === 0 && (
              <Empty
                icon={<User className="w-12 h-12 text-gray-300" />}
                title="No Collaborators"
                description="No collaborators have been added to this album yet."
              />
            )}

            {!loading && acceptedCollaborators.length > 0 && (
              <div className="space-y-3">
                {acceptedCollaborators.map((collaborator: AlbumUser) =>
                  renderCollaboratorItem(collaborator)
                )}
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
                <h4 className="text-sm font-medium text-blue-900">
                  Role Permissions
                </h4>
                <div className="mt-2 space-y-1 text-xs text-blue-700">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-3 h-3" />
                    <span>
                      <strong>Owner:</strong> Full control, can manage
                      collaborators
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Edit className="w-3 h-3" />
                    <span>
                      <strong>Editor:</strong> Can add, edit, and delete media
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-3 h-3" />
                    <span>
                      <strong>Viewer:</strong> Can only view album content
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalComponent>
      {renderRemoveMemberModal()}
    </>
  );
};

export default CollaboratorsListModal;
