import React, { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";

import type { FacebookLoginResponse } from "@/types/facebook";

import AuthenticationSection from "./AuthenticationSection";
import PostsList, { InstagramPost } from "./PostsList";

const Sync: React.FC = () => {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Dummy Instagram posts data
  const instagramPosts: InstagramPost[] = [
    {
      id: "1",
      imageUrl: "/instagram/banner-1.jpg",
      caption: "Beautiful sunset view from my recent trip! 🌅",
      timestamp: "2 hours ago",
      likes: 124,
      comments: 12,
    },
    {
      id: "2",
      imageUrl: "/instagram/banner-2.jpg",
      caption: "Coffee and coding ☕💻",
      timestamp: "5 hours ago",
      likes: 89,
      comments: 5,
    },
    {
      id: "3",
      imageUrl: "/instagram/banner-1.jpg",
      caption: "New workspace setup! 🎨",
      timestamp: "1 day ago",
      likes: 256,
      comments: 23,
    },
    {
      id: "4",
      imageUrl: "/instagram/banner-2.jpg",
      caption: "Weekend vibes 🌈",
      timestamp: "2 days ago",
      likes: 342,
      comments: 45,
    },
  ];

  const handleFacebookSuccess = (
    accessToken: string,
    response: FacebookLoginResponse
  ) => {
    console.log("Facebook authentication successful:", accessToken);
    setIsConnected(true);
    // Use userID from authResponse as account identifier
    const userId = response.authResponse?.userID || "Instagram Account";
    setConnectedAccount(`Account ${userId}`);
    // TODO: Store access token and account info
    // TODO: Fetch user name from Facebook Graph API using accessToken
  };

  const handleFacebookError = (error: string | Error) => {
    console.error("Facebook authentication error:", error);
    // TODO: Show error message to user
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setConnectedAccount(null);
    // TODO: Implement Instagram disconnection logic
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 md:px-6 xl:px-[8.28vw] xl:pt-[3.28vw] py-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Instagram Sync
          </h1>

          {/* Part 1: Authentication */}
          <AuthenticationSection
            isConnected={isConnected}
            connectedAccount={connectedAccount}
            onFacebookSuccess={handleFacebookSuccess}
            onFacebookError={handleFacebookError}
            onDisconnect={handleDisconnect}
          />

          {/* Part 2: Instagram Posts List */}
          <PostsList posts={instagramPosts} />
        </div>
      </div>
    </div>
  );
};

export default Sync;
