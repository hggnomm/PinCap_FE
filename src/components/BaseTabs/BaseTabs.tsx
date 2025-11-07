import React from "react";
import { Tabs, TabsProps } from "antd";
import clsx from "clsx";
import "./BaseTabs.less";

export interface BaseTabItem {
  key: string;
  label: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface BaseTabsProps extends Omit<TabsProps, 'items'> {
  items: BaseTabItem[];
  activeKey?: string;
  onChange?: (activeKey: string) => void;
  className?: string;
  size?: "small" | "middle" | "large";
  type?: "line" | "card" | "editable-card";
  centered?: boolean;
  tabPosition?: "top" | "right" | "bottom" | "left";
}

const BaseTabs: React.FC<BaseTabsProps> = ({
  items,
  activeKey,
  onChange,
  className,
  size = "middle",
  type = "line",
  centered = false,
  tabPosition = "top",
  ...restProps
}) => {
  return (
    <Tabs
      activeKey={activeKey}
      onChange={onChange}
      items={items}
      size={size}
      type={type}
      centered={centered}
      tabPosition={tabPosition}
      className={clsx("base-tabs", className)}
      {...restProps}
    />
  );
};

export default BaseTabs;

