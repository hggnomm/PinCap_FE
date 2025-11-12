import { useMemo, useState } from "react";

import CarouselHeader, {
  CarouselBanner,
} from "@/components/CarouselHeader/CarouselHeader";

import AuthenticationSection from "./AuthenticationSection";
import PostsList, { InstagramPost } from "./PostsList";

const instagramSamplePosts: InstagramPost[] = [
  {
    id: "1",
    imageUrl: "/instagram/banner-1.jpg",
    caption: "Beautiful sunset view from my recent trip! 🌅",
    timestamp: "2 hours ago",
    likes: 124,
    comments: 12,
    permalink: "https://instagram.com/p/sample1",
  },
  {
    id: "2",
    imageUrl: "/instagram/banner-2.jpg",
    caption: "Coffee and coding ☕💻",
    timestamp: "5 hours ago",
    likes: 89,
    comments: 5,
    permalink: "https://instagram.com/p/sample2",
  },
  {
    id: "3",
    imageUrl: "/instagram/banner-3.jpg",
    caption: "New workspace setup! 🎨",
    timestamp: "1 day ago",
    likes: 256,
    comments: 23,
    permalink: "https://instagram.com/p/sample3",
  },
  {
    id: "4",
    imageUrl: "/instagram/banner-1.jpg",
    caption: "Weekend vibes 🌈",
    timestamp: "2 days ago",
    likes: 342,
    comments: 45,
    permalink: "https://instagram.com/p/sample4",
  },
];

const Sync: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  const instagramPosts = useMemo(() => instagramSamplePosts, []);
  const banners = useMemo<CarouselBanner[]>(
    () => [
      {
        id: "banner-1",
        image: "/instagram/banner-1.jpg",
        alt: "Sync your Instagram posts effortlessly",
      },
      {
        id: "banner-2",
        image: "/instagram/banner-2.jpg",
        alt: "Manage media from a single dashboard",
      },
      {
        id: "banner-3",
        image: "/instagram/banner-3.jpg",
        alt: "Showcase your best moments on PinCap",
      },
    ],
    []
  );

  const handleConnect = () => {
    setIsConnected(true);
    setConnectedAccount("your_instagram_account");
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectedAccount(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-screen-xl space-y-8">
          <CarouselHeader
            banners={banners}
            itemClassName="rounded-2xl aspect-[24/7]"
          />

          <AuthenticationSection
            isConnected={isConnected}
            connectedAccount={connectedAccount}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />

          {isConnected && <PostsList posts={instagramPosts} />}

          {!isConnected && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-12 text-center shadow-sm">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No posts to display
              </h3>
              <p className="text-gray-600">
                Connect your Instagram account to start viewing your posts
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Sync;
