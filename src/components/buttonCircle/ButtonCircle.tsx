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
        <Menu>
          {dropdownMenu.map(({ key, title, onClick }) => (
            <Menu.Item key={key} onClick={onClick}>
              {title}
            </Menu.Item>
          ))}
        </Menu>
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
      {text && <span>{text}</span>}
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
