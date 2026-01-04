import React from "react";

import { Star } from "lucide-react";

import StatCard from "./StatCard";

interface ProfileStatsProps {
  user: {
    followers_count?: number;
    followees_count?: number;
    reaction_media_count?: number;
    medias_count?: number;
  };
  followersCount?: number; // Optional override for dynamic followers count
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  user,
  followersCount,
}) => {
  const displayFollowersCount =
    followersCount !== undefined ? followersCount : user.followers_count ?? 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        value={displayFollowersCount.toLocaleString()}
        label="Followers"
        gradientColors="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20"
        borderColor="border-gray-200 dark:border-gray-800"
        textColor="text-gray-700 dark:text-gray-300"
      />
      <StatCard
        value={user.followees_count?.toLocaleString() || 0}
        label="Following"
        gradientColors="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20"
        borderColor="border-gray-200 dark:border-gray-800"
        textColor="text-gray-700 dark:text-gray-300"
      />
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
  );
};

export default ProfileStats;

