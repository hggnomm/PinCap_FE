import React from "react";

import { clsx } from "clsx";

import { DownOutlined } from "@ant-design/icons";

import { Dropdown as AntDropdown, Button } from "antd";
import type { MenuProps } from "antd";
import "./Dropdown.less";

interface DropdownProps {
  items: MenuProps["items"];
  trigger?: ("click" | "hover" | "contextMenu")[];
  placement?:
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight"
    | "topLeft"
    | "topCenter"
    | "topRight";
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  buttonProps?: {
    type?: "primary" | "default" | "dashed" | "link" | "text";
    size?: "small" | "middle" | "large";
    className?: string;
  };
  showArrow?: boolean;
  dropdownStyle?: React.CSSProperties;
  overlayClassName?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  trigger = ["click"],
  placement = "bottomLeft",
  children,
  className,
  disabled = false,
  onOpenChange,
  open,
  buttonProps = {},
  showArrow = true,
  dropdownStyle,
  overlayClassName,
}) => {
  const {
    type = "default",
    size = "middle",
    className: buttonClassName,
    ...restButtonProps
  } = buttonProps;

  const defaultChildren = (
    <Button
      type={type}
      size={size}
      className={clsx(
        "flex items-center gap-2 transition-all duration-200 hover:shadow-md hover:scale-105",
        buttonClassName
      )}
      disabled={disabled}
      {...restButtonProps}
    >
      {children}
      {showArrow && (
        <DownOutlined className="text-xs transition-transform duration-200" />
      )}
    </Button>
  );

  return (
    <AntDropdown
      menu={{ items }}
      trigger={trigger}
      placement={placement}
      disabled={disabled}
      onOpenChange={onOpenChange}
      open={open}
      className={className}
      dropdownRender={(menu) => (
        <div
          className={clsx("custom-dropdown-menu", overlayClassName)}
          style={dropdownStyle}
        >
          {menu}
        </div>
      )}
    >
      {children || defaultChildren}
    </AntDropdown>
  );
};

export default Dropdown;
