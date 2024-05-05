import { Avatar, Button, Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { LogoIcon, TextIcon } from "../../assets/img";
import { useSelector } from "react-redux";
import Notification from "../notification";

const HeaderCommon = () => {
  const [name, setName] = useState("");
  const tokenPayload = useSelector((state: any) => state.auth);

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
    window.location.reload();
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
            <Col className="action-header" xs={{ span: 16 }} lg={{ span: 9, offset: 0 }}>
              <Col className="menu-notification">
                <Notification />
              </Col>
              <Col className="logo-avatar">
                <Avatar />
              </Col>
              <Col>
                <Button
                  onClick={() => logoutHandle()}>
                  Logout
                </Button>
              </Col>

            </Col>

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
