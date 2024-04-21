import { Avatar, Button, Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./index.less";
import { Logo } from "../../assets/img";
import { useSelector } from "react-redux";

const HeaderCommon = () => {
  const [name, setName] = useState("");
  // const { token } = useContext(AuthContext);
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
        className="logo"
        onClick={() => {
          navigate("/");
        }}
      >
        <img src={Logo} alt="" />
      </Col>
      <Col>
        {/* <Avatar icon="user" /> */}
        {tokenPayload ? <Button className="text-9xl" onClick={() => logoutHandle()}>Logout</Button> : <Button onClick={() => loginHandle()}>Login</Button>}
        {}
      </Col>
    </Row>
  );
};

export default HeaderCommon;
