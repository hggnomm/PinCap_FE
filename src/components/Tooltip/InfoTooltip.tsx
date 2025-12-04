import React from "react";

import { clsx } from "clsx";

import { QuestionCircleOutlined } from "@ant-design/icons";

import type { TooltipPlacement } from "antd/es/tooltip";

import { Tooltip } from "antd";

import "@/components/Tooltip/InfoTooltip.less";

interface InfoTooltipProps {
  title: string;
  placement?: TooltipPlacement;
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  placement = "top",
  className,
  iconClassName,
  children,
}) => {
  return (
    <Tooltip title={title} placement={placement}>
      <span className={clsx("info-tooltip", className)}>
        {children ?? (
          <QuestionCircleOutlined
            className={clsx("custom-icon", iconClassName)}
          />
        )}
      </span>
    </Tooltip>
  );
};

export default InfoTooltip;
