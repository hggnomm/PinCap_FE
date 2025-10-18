import React, { useEffect, useState } from "react";
import { useUser } from "@/react-query/useUser";
import clsx from "clsx";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  initialFollowersCount?: number;
  onFollowChange?: (isFollowing: boolean, followersCount: number) => void;
  variant?: "default" | "profile";
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialIsFollowing = false,
  initialFollowersCount = 0,
  onFollowChange,
  variant = "default",
  className,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);
  const [isLoading, setIsLoading] = useState(false);

  const { followOrBlockUser: followUser, unfollowOrUnblockUser: unfollowUser } = useUser();

  const handleFollowToggle = async () => {
    const request = "FOLLOWING";
    setIsLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        await unfollowUser({
          followeeId: userId,
          status: request,
        });

        const newFollowersCount = Math.max(0, followersCount - 1);
        setIsFollowing(false);
        setFollowersCount(newFollowersCount);
        onFollowChange?.(false, newFollowersCount);
      } else {
        // Follow
        await followUser({
          followeeId: userId,
          status: request,
        });

        const newFollowersCount = followersCount + 1;
        setIsFollowing(true);
        setFollowersCount(newFollowersCount);
        onFollowChange?.(true, newFollowersCount);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  useEffect(() => {
    setFollowersCount(initialFollowersCount);
  }, [initialFollowersCount]);

  // Variant styles
  const baseClasses = "border-none outline-none cursor-pointer font-medium transition-all";
  
  const variantClasses = {
    default: clsx(
      "ml-2.5 !px-6 !py-3 rounded-full text-base border border-gray-300",
      isFollowing 
        ? "!bg-black text-white hover:bg-gray-800" 
        : "!bg-gray-50 hover:bg-gray-100",
      "active:scale-95"
    ),
    profile: clsx(
      "!px-8 !py-3 rounded-full text-base shadow-lg",
      isFollowing
        ? "!bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 border-2 border-gray-700"
        : "!bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 border-2 border-pink-500",
      "active:scale-95"
    ),
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        isLoading && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {isLoading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;

