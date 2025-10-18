import React from "react";
import "./Empty.less";
import clsx from "clsx";

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function Empty({
  title = "Nothing here yet",
  description = "No content available",
  icon,
  className = "",
}: EmptyProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
    >
      {/* Icon/Illustration */}
      <div className="!mb-4 empty-state-icon">
        {icon ? (
          icon
        ) : (
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-60"
          >
            <circle
              cx="40"
              cy="40"
              r="38"
              stroke="var(--primary)"
              strokeWidth="2"
            />
            <path
              d="M40 28V52M28 40H52"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold !mb-2 text-[var(--foreground)]">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-center max-w-xs text-[var(--foreground)] opacity-70">
        {description}
      </p>
    </div>
  );
}
