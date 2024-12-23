import React from "react";
import { useNavigate } from "react-router-dom";
import back from "../../assets/img/PinCap/back.png";
import "./BackButton.less";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="back-container">
      <button onClick={handleBack} className="back-button">
        <img src={back} alt="Back" />
      </button>
    </div>
  );
};

export default BackButton;
