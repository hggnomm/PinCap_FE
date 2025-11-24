import clsx from "clsx";
import { ArrowRight, Instagram } from "lucide-react";

import { SocialInstagram } from "@/types/type";

interface InstagramAccountCardProps {
  account: SocialInstagram;
  title?: string;
  showTitle?: boolean;
  className?: string;
}

const InstagramAccountCard = ({
  account,
  title = "Connected Accounts",
  showTitle = true,
  className,
}: InstagramAccountCardProps) => {
  if (!account) return null;

  return (
    <div className={clsx("mb-8", className)}>
      {showTitle && (
        <h3 className="mb-4 text-xl font-semibold text-foreground">{title}</h3>
      )}
      <a
        href={account.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 transition-all hover:border-pink-300 hover:bg-pink-50 dark:border-gray-800 dark:bg-gray-900/20 dark:hover:border-pink-700 dark:hover:bg-gray-900/40"
      >
        <div className="relative h-12 w-12 overflow-hidden rounded-full shadow-md ring-2 ring-gray-200 transition-all group-hover:ring-pink-400 dark:ring-gray-700 dark:group-hover:ring-pink-600">
          <img
            src={account.avatar}
            alt={account.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors group-hover:text-pink-600 dark:text-gray-400 dark:group-hover:text-pink-400">
            <Instagram className="h-4 w-4" />
            Instagram
          </div>
          <div className="font-semibold text-foreground transition-colors group-hover:text-pink-600 dark:group-hover:text-pink-400">
            @{account.name}
          </div>
        </div>
        <div className="text-gray-400 transition-colors group-hover:text-pink-600 dark:text-gray-600 dark:group-hover:text-pink-400">
          <ArrowRight className="h-5 w-5" />
        </div>
      </a>
    </div>
  );
};

export default InstagramAccountCard;
