import React from "react";

import { clsx } from "clsx";

interface DotsPaginationProps {
  total: number;
  current: number;
  className?: string;
  onDotClick?: (index: number) => void;
}

const DotsPagination: React.FC<DotsPaginationProps> = ({
  total,
  current,
  className,
  onDotClick,
}) => {
  if (total <= 1) return null;

  return (
    <div
      className={clsx(
        "absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10",
        className
      )}
    >
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={clsx(
            "w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer",
            "origin-center will-change-transform",
            index === current
              ? "bg-white scale-110"
              : "bg-white/50 hover:bg-white/80 hover:scale-110"
          )}
          onClick={() => onDotClick?.(index)}
        />
      ))}
    </div>
  );
};

export default DotsPagination;
