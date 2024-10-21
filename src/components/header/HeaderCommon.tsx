import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Input,
  MenuProps,
  Row,
  Space,
} from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { LogoIcon, TextIcon } from "../../assets/img";
import { useSelector } from "react-redux";
import Notification from "../notification";
import { isBrowser } from "react-device-detect";

const HeaderCommon = () => {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Button>Profile</Button>,
    },
    {
      key: "2",
      label: <Button onClick={() => logoutHandle()}>Logout</Button>,
    },
  ];

  const [, setName] = useState("");
  const tokenPayload = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenPayload) {
      setName(tokenPayload.name);
    }
  }, [tokenPayload]);

  const logoutHandle = () => {
    localStorage.removeItem("token");
    navigate("/home");
    window.location.reload();
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
        {isBrowser && <img className="text-icon" src={TextIcon} />}
      </Col>

      {/* Middle Search Bar */}
      <Col className="middle-header">
        <Input
          className="search-bar"
          placeholder="Search..."
          suffix={<SearchOutlined />}
        />
      </Col>

      <Col className="right-header">
        {!tokenPayload?.id ? (
          <Col
            className="action-header"
            xs={{ span: 16 }}
            lg={{ span: 9, offset: 0 }}
          >
            <Col className="menu-notification">
              <Notification />
            </Col>
            <Space direction="vertical" className="logo-avatar">
              <Dropdown menu={{ items }} placement="bottomRight">
                <Space>
                  <Avatar src="https://imagedelivery.net/LBWXYQ-XnKSYxbZ-NuYGqQ/543c6373-55ce-4fb2-b282-dbb0e43c1500/avatarhd" />
                  <DownOutlined style={{ fontSize: "12px" }} />
                </Space>
              </Dropdown>
            </Space>
          </Col>
        ) : (
          <Col
            className="action-header"
            xs={{ span: 16 }}
            lg={{ span: 9, offset: 0 }}
          >
            <Button
              onClick={() => navigate("/sign-in")}
              className="button-auth-sign-in"
            >
              Sign in
            </Button>

            <Button
              onClick={() => navigate("/sign-up")}
              className="button-auth-sign-up"
            >
              Sign up
            </Button>
          </Col>
        )}
      </Col>
    </Row>
  );
};

export default HeaderCommon;
