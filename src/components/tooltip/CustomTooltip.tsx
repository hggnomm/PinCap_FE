import React from "react";

import clsx from "clsx";

import { Tooltip } from "antd";

interface CustomTooltipProps {
  title: string;
  children: React.ReactElement;
  placement?:
    | "top"
    | "topLeft"
    | "topRight"
    | "bottom"
    | "bottomLeft"
    | "bottomRight"
    | "left"
    | "leftTop"
    | "leftBottom"
    | "right"
    | "rightTop"
    | "rightBottom";
  className?: string;
  overlayClassName?: string;
  disabled?: boolean;
  trigger?:
    | "hover"
    | "focus"
    | "click"
    | "contextMenu"
    | Array<"hover" | "focus" | "click" | "contextMenu">;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  title,
  children,
  placement = "top",
  className,
  overlayClassName,
  disabled = false,
  trigger = "hover",
}) => {
  if (disabled) {
    return children;
  }

  return (
    <Tooltip
      title={title}
      placement={placement}
      overlayClassName={clsx("custom-tooltip", overlayClassName)}
      className={clsx(className)}
      trigger={trigger}
      arrow={false}
      overlayStyle={{
        fontSize: "12px",
        maxWidth: "300px",
        textAlign: "center",
      }}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
