import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Search, User, Loader2 } from "lucide-react";

import ModalComponent from "@/components/Modal/ModalComponent";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/react-query/useAuth";
import { useUser } from "@/react-query/useUser";
import { User as UserType } from "@/types/type";

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

interface ViewRelationshipsModalProps {
  visible: boolean;
  onCancel: () => void;
  userId: string;
  relationship: "followers" | "followees";
}

const ViewRelationshipsModal: React.FC<ViewRelationshipsModalProps> = ({
  visible,
  onCancel,
  userId,
  relationship,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { getUserRelationships } = useUser();
  const relationshipsQuery = getUserRelationships(
    userId,
    relationship,
    visible
  );
  // Handle both array response and object with data property
  const users = Array.isArray(relationshipsQuery.data)
    ? relationshipsQuery.data
    : relationshipsQuery.data?.data || [];

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!visible) {
      setSearchTerm("");
    }
  }, [visible]);

  // Filter users based on search term
  const filteredUsers = users.filter((user: UserType) => {
    if (!debouncedSearchTerm) return true;
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower)
    );
  });

  const title = relationship === "followers" ? "Followers" : "Following";

  const handleNavigateToProfile = (targetUserId: string) => {
    if (!targetUserId) return;

    // Close modal first
    onCancel();

    // Navigate to profile
    if (currentUser && targetUserId === currentUser.id) {
      navigate(ROUTES.PROFILE);
    } else {
      navigate(ROUTES.USER_PROFILE.replace(":id", targetUserId));
    }
  };

  return (
    <ModalComponent
      titleDefault={title}
      className="!w-[600px]"
      visible={visible}
      onCancel={onCancel}
      showFooter={false}
    >
      <div className="p-5">
        {/* Search Field */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* User List */}
        <div className="max-h-96 overflow-y-auto">
          {relationshipsQuery.isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-rose-600" />
              <span className="ml-2 text-gray-600">Loading {title}...</span>
            </div>
          )}

          {!relationshipsQuery.isLoading &&
            debouncedSearchTerm &&
            filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No users found for &quot;{debouncedSearchTerm}&quot;</p>
              </div>
            )}

          {!relationshipsQuery.isLoading &&
            !debouncedSearchTerm &&
            users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No {title.toLowerCase()} yet</p>
              </div>
            )}

          {!relationshipsQuery.isLoading && filteredUsers.length > 0 && (
            <div className="space-y-2">
              {filteredUsers.map((user: UserType) => (
                <div
                  key={user.id}
                  onClick={() => handleNavigateToProfile(user.followee_id)}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3 flex-1">
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
                      <p className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ModalComponent>
  );
};

export default ViewRelationshipsModal;
