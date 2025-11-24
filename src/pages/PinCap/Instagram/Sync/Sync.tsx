import { useEffect, useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { getFacebookOAuthUrl, getMyProfile } from "@/api/users";
import CarouselHeader, {
  CarouselBanner,
} from "@/components/CarouselHeader/CarouselHeader";
import { showErrorToast } from "@/utils/apiErrorHandler";

import AuthenticationSection from "./AuthenticationSection";
import PostsList from "./elements/PostsList";

const Sync: React.FC = () => {
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

  const {
    data: user,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000,
  });

  const account = user?.social_instagram ?? null;
  const isConnected = Boolean(account);

  useEffect(() => {
    if (profileError) {
      showErrorToast(profileError, "Unable to load your profile information");
    }
  }, [profileError]);

  const handleConnect = async () => {
    try {
      const response = await getFacebookOAuthUrl();
      const redirectUrl = response?.url;

      if (typeof redirectUrl === "string" && redirectUrl.length > 0) {
        // Redirect directly to Facebook OAuth URL (no popup)
        window.location.href = redirectUrl;
        return;
      }

      throw new Error("Missing Facebook OAuth redirect URL");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to start Facebook authentication";
      showErrorToast(error, message);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="w-full px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-screen-xl space-y-8">
          <CarouselHeader banners={banners} />

          <AuthenticationSection
            isConnected={isConnected}
            account={account}
            onConnect={handleConnect}
          />

          {isConnected && <PostsList />}

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
                {isProfileLoading && " ..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Sync;
