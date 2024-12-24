import React from "react";
import "./ButtonCircle.less";
import { Dropdown, Menu } from "antd";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";

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
    | "padding-0-8";
  dropdownMenu?: DropdownItem[]; // Mảng các đối tượng cấu hình cho menu
}

const ButtonCircle = ({
  text,
  icon,
  onClick,
  paddingClass = "padding-medium",
  dropdownMenu,
}: ButtonCircleProps) => {
  // function render menu when receive DropdownItem to implement function whatever
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
          }}
        >
          {text && (
            <div style={{ padding: 8 }}>
              <span style={{ fontWeight: 400 }}>{text}</span>
            </div>
          )}
          <Menu
            style={{ border: "none", boxShadow: "none", background: "none" }}
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
