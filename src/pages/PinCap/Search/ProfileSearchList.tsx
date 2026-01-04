import React, { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getMediasByUserId } from "@/api/media";
import { PaginatedMediaResponse } from "@/types/Media/MediaResponse";
import { Media, User } from "@/types/type";
import { getMediaPreviewUrl } from "@/utils/utils";

import ProfileSearchItem from "./ProfileSearchItem";

interface ProfileSearchListProps {
  profilesQueryFn: () => Promise<User[]>;
  query: string;
}

const ProfileSearchList: React.FC<ProfileSearchListProps> = ({
  profilesQueryFn,
  query,
}) => {
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["searchProfiles", query],
    queryFn: profilesQueryFn,
    enabled: !!query,
  });

  const [usersWithPreviews, setUsersWithPreviews] = useState<
    (User & { preview_images?: string[] })[]
  >([]);

  // Fetch preview images for each user
  useEffect(() => {
    const fetchPreviews = async () => {
      const usersWithImages = await Promise.all(
        users.map(async (user) => {
          try {
            // Fetch first 4 media items for preview
            const mediaResponse = (await getMediasByUserId({
              user_id: user.id,
              per_page: 4,
              page: 1,
            })) as PaginatedMediaResponse<Media>;

            const previewImages =
              mediaResponse?.data
                ?.slice(0, 4)
                .map((media: Media) =>
                  getMediaPreviewUrl(media.media_url, media.type)
                )
                .filter((url: string | null): url is string => url !== null) ||
              [];

            return {
              ...user,
              preview_images: previewImages,
            };
          } catch (error) {
            console.error(
              `Error fetching preview images for user ${user.id}:`,
              error
            );
            return {
              ...user,
              preview_images: [],
            };
          }
        })
      );

      // Sort users: those with preview images first
      const sortedUsers = usersWithImages.sort((a, b) => {
        const aHasImages = a.preview_images && a.preview_images.length > 0;
        const bHasImages = b.preview_images && b.preview_images.length > 0;

        if (aHasImages && !bHasImages) return -1;
        if (!aHasImages && bHasImages) return 1;
        return 0;
      });

      setUsersWithPreviews(sortedUsers);
    };

    if (users.length > 0) {
      fetchPreviews();
    } else {
      setUsersWithPreviews([]);
    }
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading profiles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">
          Error loading profiles. Please try again.
        </div>
      </div>
    );
  }

  if (usersWithPreviews.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-2">No profiles found</p>
          <p className="text-gray-400 text-sm">
            Try searching with different keywords
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 mx-auto w-[650px] space-y-8">
      {usersWithPreviews?.map((user) => (
        <ProfileSearchItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default ProfileSearchList;
