"use client";

import { clsx } from "clsx";

import { INSTAGRAM_MEDIA_TYPES, InstagramMedia } from "@/types/instagram";

interface MediaPostProps {
  post: InstagramMedia;
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

const MediaPost = ({ post }: MediaPostProps) => {
  const imageUrl = getDisplayImage(post) || "/placeholder.svg";

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={post.caption || `Instagram post ${post.id}`}
          className="h-full w-full object-cover transition-transform duration-150 group-hover:scale-[1.01]"
        />
        <div className="absolute inset-0 bg-black/0 transition-opacity duration-150 group-hover:bg-black/5" />
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between text-xs font-medium text-gray-600">
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
            {formatMediaType(post.media_type)}
            {!!post.children?.data?.length && (
              <span className="text-[0.7rem] text-gray-500">
                {post.children.data.length} items
              </span>
            )}
          </span>
          <span
            className={clsx(
              "rounded-full px-3 py-1",
              post.is_synced
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            )}
          >
            {post.is_synced ? "Synced" : "Not synced"}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-gray-700">
          {post.caption || "No caption provided"}
        </p>

        <div className="border-t border-gray-100 pt-4">
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View on Instagram
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MediaPost;
