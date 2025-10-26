// This component is designed to create a circular button with a black focus effect. It can optionally include a dropdown menu, but is fully functional as a standalone button as well. Please refer to the detailed code for implementation and usage instructions.

// If you are unsure about how to use it, feel free to explore other references or implementations of similar button components for guidance.

import React from "react";

import "./ButtonCircle.less";
import { Dropdown, Menu } from "antd";

interface DropdownItem {
  key: string;
  title: string;
  onClick: () => void;
}

interface ButtonCircleProps {
  text?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  paddingClass?:
    | "padding-small"
    | "padding-medium"
    | "padding-large"
    | "padding-huge"
    | "padding-0-8"
    | string;
  dropdownMenu?: DropdownItem[];
}

const ButtonCircle = ({
  text,
  icon,
  onClick,
  paddingClass = "padding-medium",
  dropdownMenu,
}: ButtonCircleProps) => {
  const renderMenu = () => {
    if (dropdownMenu) {
      return (
        <div
          style={{
            width: "200px",
            height: "auto",
            padding: 10,
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            borderRadius: 10,
            background: "#F6F6F6",
            zIndex: 10,
          }}
        >
          {text && (
            <div style={{ padding: 8 }}>
              <span style={{ fontWeight: 400 }}>{text}</span>
            </div>
          )}
          <Menu
            style={{
              border: "none",
              boxShadow: "none",
              // background: "none",
            }}
          >
            {dropdownMenu.map(({ key, title, onClick }) => (
              <Menu.Item
                key={key}
                onClick={onClick}
                style={{ fontWeight: 500, padding: "12px 10px" }}
              >
                {title}
              </Menu.Item>
            ))}
          </Menu>
        </div>
      );
    }
    return null;
  };

  const renderButton = (
    <button
      className={`button-circle ${paddingClass}`}
      onClick={onClick}
      tabIndex={0} // focus button
    >
      {icon && <span className="icon">{icon}</span>}
    </button>
  );

  // If component use props dropdownMenu, using Dropdown to display menu
  if (dropdownMenu) {
    return (
      <Dropdown overlay={renderMenu()} trigger={["click"]}>
        {renderButton}
      </Dropdown>
    );
  }

  return renderButton;
};

export default ButtonCircle;
