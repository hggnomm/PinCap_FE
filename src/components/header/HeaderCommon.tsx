import { Avatar, Button, Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { LogoIcon, TextIcon } from "../../assets/img";
import { useSelector } from "react-redux";

const HeaderCommon = () => {
  const [name, setName] = useState("");
  const tokenPayload = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [collapseMenu, setCollapseMenu] = useState(false);
  useEffect(() => {
    if (tokenPayload) {
      setName(tokenPayload.name);
    }
  }, []);

  const logoutHandle = () => {
    localStorage.removeItem("token");
    navigate("/home");
    window.location.reload(true);
  };
  const loginHandle = () => {
    navigate("/sign-in");
  };
  return (
    <Row className="main-header">
      <Col
        className="left-header"
        onClick={() => {
          navigate("/home");
        }}
      >
        <img className="logo-icon" src={LogoIcon} />
        <img className="text-icon" src={TextIcon} />
      </Col>
      <Col
        className="right-header"
      >
        {
          tokenPayload?.id ?
            <>
              <Avatar />
              <Button
                className="text-9xl"
                onClick={() => logoutHandle()}
              >Logout</Button>
            </>


            :
            <>
              <Button
                onClick={() => loginHandle()}
                className="button-auth-sign-in"
              >
                Sign in
              </Button>

              <Button
                onClick={() => loginHandle()}
                className="button-auth-sign-up"
              >
                Sign up
              </Button>
            </>

        }
      </Col>
    </Row>
  );
};

export default HeaderCommon;
