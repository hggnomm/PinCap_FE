"use client";

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  timestamp: string;
  likes: number;
  comments: number;
  permalink: string;
}

interface PostsListProps {
  posts: InstagramPost[];
}

export default function PostsList({ posts }: PostsListProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 lg:p-12 shadow-sm">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Instagram Posts
      </h2>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-transform duration-200 hover:shadow-md hover:scale-[1.02]"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={post.imageUrl || "/placeholder.svg"}
                alt={post.caption}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.04]"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/10" />
            </div>

            {/* Post Info */}
            <div className="space-y-4 p-4">
              {/* Caption */}
              <p className="line-clamp-2 text-sm text-gray-700">
                {post.caption}
              </p>

              {/* Metadata */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-500">{post.timestamp}</p>

                {/* Stats */}
                <div className="flex items-center justify-start gap-6">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      {post.likes.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      {post.comments.toLocaleString()}
                    </span>
                  </div>
                </div>

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
        ))}
      </div>
    </div>
  );
}
