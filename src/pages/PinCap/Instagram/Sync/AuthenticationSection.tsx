"use client";

import { Link } from "react-router-dom";

import InstagramAccountCard from "@/components/ConnectedAccounts/InstagramAccountCard";
import { ROUTES } from "@/constants/routes";
import { SocialInstagram } from "@/types/type";

interface AuthenticationSectionProps {
  isConnected: boolean;
  account?: SocialInstagram | null;
  onConnect: () => void | Promise<void>;
  onDisconnect?: () => void;
}

export default function AuthenticationSection({
  isConnected,
  account,
  onConnect,
  onDisconnect: _onDisconnect,
}: AuthenticationSectionProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 sm:px-10 sm:py-7 lg:px-12 lg:py-8 shadow-sm">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Connect Your Account
          </h2>
          <Link
            to={ROUTES.INSTAGRAM_ABOUT}
            className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/60 px-4 py-1.5 text-xs sm:text-sm font-medium text-purple-600 transition-colors hover:border-purple-300 hover:bg-purple-100 hover:text-purple-700"
          >
            View terms & learn more
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {!isConnected && (
        <div className="flex flex-col items-center ">
          <button
            onClick={onConnect}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-purple-600 hover:to-pink-600 active:scale-95"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Connect Instagram
          </button>
        </div>
      )}

      {isConnected && (
        <div>
          {/* Connected State */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Disconnect Button */}
            <button
              type="button"
              disabled
              className="rounded-lg border border-red-200 bg-white px-6 py-2 font-medium text-red-400 transition-all disabled:cursor-not-allowed disabled:opacity-60"
              title="Disconnect support coming soon"
            >
              Disconnect (coming soon)
            </button>
          </div>

          {account && (
            <InstagramAccountCard
              account={account}
              showTitle={false}
              className="mt-4"
            />
          )}
        </div>
      )}
    </div>
  );
}
