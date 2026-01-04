import React from "react";

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
  <div className={`${gradientColors} p-4 rounded-2xl border ${borderColor}`}>
    <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
    <div className={`text-sm ${textColor}/70 flex items-center gap-1`}>
      {icon}
      {label}
    </div>
  </div>
);

export default StatCard;

