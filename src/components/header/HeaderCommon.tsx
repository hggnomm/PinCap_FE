import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Input,
  MenuProps,
  Row,
  Space,
  Tooltip,
} from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { LogoIcon, TextIcon } from "../../assets/img";
import { useSelector } from "react-redux";
import Notification from "../notification";
import { isBrowser } from "react-device-detect";
import iconChatbot from "../../assets/img/PinCap/chatbot.png";
import Chatbot from "../chatbot";

const HeaderCommon = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div style={{ padding: "2px 8px", minWidth: 200 }}>
          <div style={{ fontWeight: "bold" }}>Trần Hoàng Nam</div>
          <div>@hggnomm</div>
        </div>
      ),
    },
    {
      type: "divider", // Gạch kẻ chia
    },
    {
      key: "3",
      label: (
        <div style={{ padding: "2px 8px" }}>
          <div onClick={() => logoutHandle()}>Sign out</div>
        </div>
      ),
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
            <Tooltip title="Pinbot: Virtual Assistant" placement="bottom">
              <div className="chatbot-btn" onClick={toggleChatbot}>
                <img
                  src={iconChatbot}
                  alt="Chatbot"
                  style={{ width: "16px" }}
                />
              </div>
            </Tooltip>

            {/* Màn hình Chatbot mini */}
            {isChatbotOpen && <Chatbot toggleChatbot={toggleChatbot} isOpen={isChatbotOpen} />}

            <Col className="menu-notification">
              <Notification />
            </Col>

            <Space direction="vertical" className="logo-avatar">
              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                trigger={["click"]}
                className="dropdown_item"
              >
                <Space>
                  <Avatar
                    className="avatar"
                    src="https://imagedelivery.net/LBWXYQ-XnKSYxbZ-NuYGqQ/543c6373-55ce-4fb2-b282-dbb0e43c1500/avatarhd"
                  />
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
