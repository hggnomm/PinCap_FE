import React from "react";

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
}

const InfoItem: React.FC<InfoItemProps> = ({
  icon,
  label,
  value,
  bgColor,
  iconColor,
}) => (
  <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
    <div
      className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}
    >
      <div className={iconColor}>{icon}</div>
    </div>
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  </div>
);

export default InfoItem;
