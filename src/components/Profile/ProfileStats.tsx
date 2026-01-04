import React, { useState } from "react";

import { Star } from "lucide-react";

import ViewRelationshipsModal from "@/components/Modal/user/ViewRelationshipsModal";
import StatCard from "./StatCard";

interface ProfileStatsProps {
  user: {
    id?: string;
    followers_count?: number;
    followees_count?: number;
    reaction_media_count?: number;
    medias_count?: number;
  };
  followersCount?: number; // Optional override for dynamic followers count
  userId?: string; // Optional userId for viewing relationships (defaults to user.id)
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  user,
  followersCount,
  userId,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [relationshipType, setRelationshipType] = useState<
    "followers" | "followees"
  >("followers");

  const displayFollowersCount =
    followersCount !== undefined ? followersCount : user.followers_count ?? 0;

  const targetUserId = userId || user.id || "";

  const handleOpenModal = (type: "followers" | "followees") => {
    setRelationshipType(type);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => handleOpenModal("followers")}
          className="text-left cursor-pointer hover:opacity-80 transition-opacity"
        >
          <StatCard
            value={displayFollowersCount.toLocaleString()}
            label="Followers"
            gradientColors="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20"
            borderColor="border-gray-200 dark:border-gray-800"
            textColor="text-gray-700 dark:text-gray-300"
          />
        </button>
        <button
          onClick={() => handleOpenModal("followees")}
          className="text-left cursor-pointer hover:opacity-80 transition-opacity"
        >
          <StatCard
            value={user.followees_count?.toLocaleString() || 0}
            label="Following"
            gradientColors="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20"
            borderColor="border-gray-200 dark:border-gray-800"
            textColor="text-gray-700 dark:text-gray-300"
          />
        </button>
        <StatCard
          value={user.reaction_media_count?.toLocaleString() || 0}
          label="Reaction"
          icon={<Star className="w-3 h-3 fill-current" />}
          gradientColors="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20"
          borderColor="border-pink-200 dark:border-pink-800"
          textColor="text-pink-600 dark:text-pink-400"
        />
        <StatCard
          value={user.medias_count?.toLocaleString() || 0}
          label="Pin"
          gradientColors="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20"
          borderColor="border-rose-200 dark:border-rose-800"
          textColor="text-rose-600 dark:text-rose-400"
        />
      </div>

      {targetUserId && (
        <ViewRelationshipsModal
          visible={modalVisible}
          onCancel={handleCloseModal}
          userId={targetUserId}
          relationship={relationshipType}
        />
      )}
    </>
  );
};

export default ProfileStats;

