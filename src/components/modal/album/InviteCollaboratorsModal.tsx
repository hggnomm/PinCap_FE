import React, { useState, useEffect } from "react";
import { Search, User, Loader2 } from "lucide-react";
import clsx from "clsx";
import ModalComponent from "@/components/modal/ModalComponent";
import { useUser } from "@/hooks/useUser";
import { useAlbum } from "@/hooks/useAlbum";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface InviteCollaboratorsModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  albumId: string;
  loading?: boolean;
}

const InviteCollaboratorsModal: React.FC<InviteCollaboratorsModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  albumId,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set());

  const { findUsers } = useUser();
  const { inviteUserToAlbum } = useAlbum();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const searchQuery = findUsers(debouncedSearchTerm);
  const users = searchQuery.data?.data || [];

  useEffect(() => {
    if (!visible) {
      setSearchTerm("");
      setInvitedUsers(new Set());
    }
  }, [visible]);

  const handleInviteUser = async (userId: string) => {
    try {
      await inviteUserToAlbum({ albumId, userId });
      setInvitedUsers((prev) => new Set(prev).add(userId));
    } catch (error) {
      console.error("Failed to invite user:", error);
    }
  };

  return (
    <ModalComponent
      titleDefault="Invite Collaborators"
      className="!w-[600px]"
      visible={visible}
      onCancel={onCancel}
      onConfirm={onConfirm}
      buttonLabels={{ confirmLabel: "Done", cancelLabel: "Cancel" }}
    >
      <div className="p-5">
        {/* Search Field */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {searchQuery.isLoading && debouncedSearchTerm && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-rose-600" />
              <span className="ml-2 text-gray-600">Searching users...</span>
            </div>
          )}

          {debouncedSearchTerm &&
            !searchQuery.isLoading &&
            users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No users found for "{debouncedSearchTerm}"</p>
              </div>
            )}

          {users.length > 0 && (
            <div className="space-y-2">
              {users.map((user: any) => (
                <div
                  key={user.id}
                  className="relative flex items-center p-3 pr-24 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInviteUser(user.id)}
                    className={clsx(
                      "!absolute right-3 !px-4 !py-2 rounded-lg text-sm font-medium transition-colors",
                      invitedUsers.has(user.id)
                        ? "!bg-green-100 text-green-600 cursor-not-allowed"
                        : "!bg-rose-600 text-white hover:bg-rose-700"
                    )}
                  >
                    {invitedUsers.has(user.id) ? "Invited" : "Invite"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {!debouncedSearchTerm && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Start typing to search for users to invite</p>
            </div>
          )}
        </div>
      </div>
    </ModalComponent>
  );
};

export default InviteCollaboratorsModal;
