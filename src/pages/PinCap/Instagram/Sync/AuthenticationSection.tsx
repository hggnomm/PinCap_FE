"use client";

import { useState } from "react";

import { Link } from "react-router-dom";

import { notification } from "antd";

import { unlinkInstagramAccount } from "@/api/instagram";
import InstagramAccountCard from "@/components/ConnectedAccounts/InstagramAccountCard";
import { ROUTES } from "@/constants/routes";
import { SocialInstagram } from "@/types/type";
import { showErrorToast } from "@/utils/apiErrorHandler";

interface AuthenticationSectionProps {
  isConnected: boolean;
  account?: SocialInstagram | null;
  onConnect: () => void | Promise<void>;
  onDisconnect?: () => void | Promise<void>;
}

export default function AuthenticationSection({
  isConnected,
  account,
  onConnect,
  onDisconnect: onDisconnect,
}: AuthenticationSectionProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    if (isDisconnecting) return;

    setIsDisconnecting(true);
    try {
      const response = await unlinkInstagramAccount();

      notification.success({
        message: "Instagram disconnected",
        description: response?.message || "Unlink instagram successfully",
      });

      if (onDisconnect) {
        await onDisconnect();
      }
    } catch (error: unknown) {
      showErrorToast(
        error,
        "Failed to disconnect Instagram account. Please try again."
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 lg:p-8 shadow-sm">
      {!isConnected && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Connect Your Account
          </h2>
          <button
            onClick={onConnect}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-900 active:scale-95"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Connect Instagram
          </button>
          <Link
            to={ROUTES.INSTAGRAM_ABOUT}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            View terms & learn more
          </Link>
        </div>
      )}

      {isConnected && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              type="button"
              disabled={isDisconnecting}
              onClick={handleDisconnect}
              className="rounded-lg border border-red-200 bg-white px-6 py-2 font-medium text-red-500 transition-all disabled:cursor-not-allowed disabled:opacity-60 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              title="Disconnect Instagram account"
            >
              {isDisconnecting ? "Disconnecting..." : "Disconnect"}
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
