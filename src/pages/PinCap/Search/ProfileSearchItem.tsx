import React, { useState } from "react";

import { clsx } from "clsx";

import FollowButton from "@/components/FollowButton/FollowButton";
import { User } from "@/types/type";
import { formatFollowerCount } from "@/utils/format";

interface ProfileSearchItemProps {
  user: User & {
    preview_images?: string[]; // Array of preview image URLs
  };
}

const ProfileSearchItem: React.FC<ProfileSearchItemProps> = ({ user }) => {
  const [followersCount, setFollowersCount] = useState(
    user.followers_count || 0
  );

  const handleFollowChange = (isFollowing: boolean, newCount: number) => {
    setFollowersCount(newCount);
  };

  // Get preview images (up to 4)
  const previewImages = user.preview_images?.slice(0, 4) || [];

  // Only show images if there are actual images (not empty array)
  const hasImages = previewImages.length > 0;

  return (
    <div className="group w-full cursor-pointer rounded-xl p-4 bg-transparent hover:bg-gray-200 flex flex-col items-center justify-center overflow-hidden ">
      {/* Preview Images Grid - Top Section - Only show if images exist */}
      {hasImages && (
        <div className="grid grid-cols-4 bg-white rounded-xl overflow-hidden gap-0.5 mb-2 w-full">
          {previewImages.map((imageUrl, index) => (
            <div
              key={index}
              className={clsx(
                "relative overflow-hidden bg-gray-100",
                "hover:opacity-90 transition-opacity",
                "aspect-[3/4]"
              )}
            >
              <img
                src={imageUrl}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.jpg";
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* User Info Row - Bottom Section */}
      <div className="flex items-center w-full gap-3">
        {/* Left: Avatar */}
        <div className="flex-shrink-0">
          <img
            src={user.avatar || "/placeholder-user.jpg"}
            alt={`${user.first_name} ${user.last_name}`}
            className="w-14 h-14 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-user.jpg";
            }}
          />
        </div>

        {/* Center: Name and Followers */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-gray-900 truncate">
              {user.name}
            </span>
          </div>
          <p className="text-base text-gray-600">
            {formatFollowerCount(followersCount)} followers
          </p>
        </div>

        {/* Right: Follow Button */}
        <div className="flex-shrink-0">
          <FollowButton
            userId={user.id}
            initialIsFollowing={user.isFollowing || false}
            initialFollowersCount={followersCount}
            onFollowChange={handleFollowChange}
            variant="default"
            className="!px-6 !py-2.5 !text-base !font-bold !bg-gray-200 hover:!bg-gray-300 group-hover:!bg-gray-300 !text-gray-900 !border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSearchItem;
