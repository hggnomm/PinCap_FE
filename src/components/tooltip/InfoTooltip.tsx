import React from "react";

import { clsx } from "clsx";

import { QuestionCircleOutlined } from "@ant-design/icons";

import { Tooltip } from "antd";

import "@/components/tooltip/InfoTooltip.less";

interface InfoTooltipProps {
  title: string;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight";
  className?: string;
  iconClassName?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title,
  placement = "top",
  className,
  iconClassName,
}) => {
  return (
    <Tooltip title={title} placement={placement}>
      <span className={clsx("info-tooltip", className)}>
        <QuestionCircleOutlined
          className={clsx("custom-icon", iconClassName)}
        />
      </span>
    </Tooltip>
  );
};

export default InfoTooltip;
