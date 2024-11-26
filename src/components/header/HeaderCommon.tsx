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

// Type for user information
interface UserInfo {
  name: string;
  email: string;
}

const HeaderCommon = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [userInfor, setUserInfor] = useState<UserInfo>({ name: "", email: "" });
  const tokenPayload = useSelector((state: any) => state.auth);
  const navigate = useNavigate();

  // Set user info when tokenPayload changes
  useEffect(() => {
    if (tokenPayload) {
      setUserInfor({
        name: tokenPayload.name,
        email: tokenPayload.email,
      });
    }
  }, [tokenPayload]);

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setIsChatbotOpen((prevState) => !prevState);
  };

  // Handle user logout
  const logoutHandle = () => {
    localStorage.removeItem("token");
    navigate("/home");
    window.location.reload();
  };

  // Define menu items for the dropdown
  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div style={{ padding: "2px 8px", minWidth: 200 }}>
          <div style={{ fontWeight: "bold" }}>{userInfor.name}</div>
          <div>{userInfor.email}</div>
        </div>
      ),
    },
    { type: "divider" },
    {
      key: "3",
      label: (
        <div style={{ padding: "5px 8px" }} onClick={logoutHandle}>
          <div>Sign out</div>
        </div>
      ),
    },
  ];

  return (
    <Row className="main-header">
      <Col className="left-header" onClick={() => navigate("/home")}>
        <img className="logo-icon" src={LogoIcon} alt="Logo" />
        {isBrowser && <img className="text-icon" src={TextIcon} alt="Text" />}
      </Col>

      {/* Middle Search Bar */}
      {tokenPayload?.id && (
        <Col className="middle-header">
          <Input
            className="search-bar"
            placeholder="Search..."
            suffix={<SearchOutlined />}
          />
        </Col>
      )}

      <Col className="right-header">
        {tokenPayload?.id ? (
          <Col className="action-header" xs={{ span: 16 }} lg={{ span: 9 }}>
            {/* Chatbot Button */}
            <Tooltip title="Pinbot: Virtual Assistant" placement="bottom">
              <div className="chatbot-btn" onClick={toggleChatbot}>
                <img
                  src={iconChatbot}
                  alt="Chatbot"
                  style={{ width: "16px" }}
                />
              </div>
            </Tooltip>

            {/* Chatbot mini screen */}
            {isChatbotOpen && (
              <Chatbot toggleChatbot={toggleChatbot} isOpen={isChatbotOpen} />
            )}

            {/* Notification Section */}
            <Col className="menu-notification">
              <Notification />
            </Col>

            {/* User Avatar and Dropdown */}
            <Space direction="vertical" className="logo-avatar">
              <Dropdown
                menu={{ items: menuItems }}
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
          <Col className="action-header" xs={{ span: 16 }} lg={{ span: 9 }}>
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
