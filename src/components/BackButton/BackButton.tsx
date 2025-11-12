import type { MouseEvent } from "react";

import { useNavigate } from "react-router-dom";

import classNames from "clsx";

import back from "@/assets/img/PinCap/back.png";

import "./BackButton.less";

type BackButtonProps = {
  to?: string;
  text?: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const BackButton = ({ to, text, className, onClick }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = (event: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    if (to) {
      navigate(to);
      return;
    }

    navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={classNames(
        "back-button",
        { "back-button--with-text": Boolean(text) },
        className
      )}
    >
      <img src={back} alt="Back" className="back-button__icon" />
      {text ? <span className="back-button__text">{text}</span> : null}
    </button>
  );
};

export default BackButton;
