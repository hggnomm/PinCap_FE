import React from "react";

import { clsx } from "clsx";

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  gradientColors: string;
  borderColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  gradientColors,
  borderColor,
  textColor,
}) => (
  <div className={clsx(gradientColors, "p-4 rounded-2xl border", borderColor)}>
    <div className={clsx("text-2xl font-bold", textColor)}>{value}</div>
    <div className={clsx("text-sm flex items-center gap-1", `${textColor}/70`)}>
      {icon}
      {label}
    </div>
  </div>
);

export default StatCard;
