import React from "react";
import "./ButtonCircle.less";

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
}

const ButtonCircle = ({
  text,
  icon,
  onClick,
  paddingClass = "padding-medium",
}: ButtonCircleProps) => {
  return (
    <button
      className={`button-circle ${paddingClass}`}
      onClick={onClick}
      tabIndex={0} // Cho phép nút nhận focus
    >
      {icon && <span className="icon">{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );
};

export default ButtonCircle;
