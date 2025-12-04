"use client";

import { clsx } from "clsx";
import { ExternalLink } from "lucide-react";

import { INSTAGRAM_MEDIA_TYPES, InstagramMedia } from "@/types/instagram";

interface MediaPostProps {
  post: InstagramMedia;
  onSyncClick?: (post: InstagramMedia, previewUrl: string) => void;
}

const getDisplayImage = (post: InstagramMedia) => {
  if (post.media_type === INSTAGRAM_MEDIA_TYPES.CAROUSEL_ALBUM) {
    return post.children?.data?.[0]?.media_url || post.media_url;
  }
  return post.media_url;
};

const formatMediaType = (type: string) =>
  type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());

const MediaPost = ({ post, onSyncClick }: MediaPostProps) => {
  const imageUrl = getDisplayImage(post) || "/placeholder.svg";

  return (
    <div className="group overflow-hidden rounded-b-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:border-pink-200 hover:shadow-lg">
      <div className="aspect-[3/4] overflow-hidden  bg-gray-100">
        <img
          src={imageUrl}
          alt={post.caption || `Instagram post ${post.id}`}
          className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-[1.01]"
        />
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-[0.7rem] font-semibold text-gray-700">
            {formatMediaType(post.media_type)}
            {!!post.children?.data?.length && (
              <span className="text-gray-400">
                {post.children.data.length} items
              </span>
            )}
          </div>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open on Instagram"
            className="inline-flex items-center gap-2 rounded-full bg-gray-100 p-2 text-[0.7rem] font-semibold text-gray-700 transition-colors hover:bg-gray-200"
          >
            <ExternalLink className="h-4 w-4 text-blue-600" />
          </a>
        </div>

        <p
          className={clsx(
            "line-clamp-2 mb-0 text-sm",
            post.caption ? "text-gray-700" : "italic text-gray-400"
          )}
        >
          {post.caption || "No caption"}
        </p>

        {!post.is_synced && (
          <button
            type="button"
            onClick={() => onSyncClick?.(post, imageUrl)}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            Sync this post
          </button>
        )}

        {post.is_synced && (
          <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-2 text-center text-sm font-medium text-green-700">
            Already synced
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPost;
