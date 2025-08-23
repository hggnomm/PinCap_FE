import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { useNavigate } from "react-router-dom";
import Notification from "../notification";
import { LogoIcon, TextIcon } from "../../assets/img";
import iconChatbot from "../../assets/img/PinCap/chatbot.png";
import Chatbot from "../chatbot";
import { addToken } from "../../store/authSlice";
import "./index.less";
import { ROUTES } from "../../constants/routes";

interface UserInfo {
  name: string;
  email: string;
}

const HeaderCommon = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [userInfor, setUserInfor] = useState<UserInfo>({ name: "", email: "" });
  const tokenPayload = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (tokenPayload?.name && tokenPayload?.email) {
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
    dispatch(addToken(null));
    navigate(ROUTES.LOGIN);
  };

  const menuItems = [
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
        <Button
          style={{ width: "100%", textAlign: "left", color: "black" }}
          onClick={logoutHandle}
          type="link"
        >
          Sign out
        </Button>
      ),
    },
  ];

  const isAuthenticated = tokenPayload?.id || localStorage.getItem("token");

  return (
    <Row className="main-header">
      <Col
        className="left-header"
        onClick={() => (isAuthenticated ? navigate(ROUTES.PINCAP_HOME) : navigate(ROUTES.LOGIN))}
      >
        <img className="logo-icon" src={LogoIcon} alt="Logo" />
        {isAuthenticated && (
          <img className="text-icon" src={TextIcon} alt="Text" />
        )}
      </Col>

      {/* Middle Search Bar */}
      {isAuthenticated && (
        <Col className="middle-header">
          <Input
            className="search-bar"
            placeholder="Search..."
            suffix={<SearchOutlined />}
          />
        </Col>
      )}

      <Col className="right-header">
        {isAuthenticated ? (
          <Col className="action-header" xs={{ span: 16 }} lg={{ span: 9 }}>
            <Tooltip title="Pinbot: Virtual Assistant" placement="bottom">
              <div className="chatbot-btn" onClick={toggleChatbot}>
                <img
                  src={iconChatbot}
                  alt="Chatbot"
                  style={{ width: "16px" }}
                />
              </div>
            </Tooltip>

            {isChatbotOpen && (
              <Chatbot toggleChatbot={toggleChatbot} isOpen={isChatbotOpen} />
            )}

            <Col className="menu-notification">
              <Notification />
            </Col>

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
              onClick={() => navigate("/login")}
              className="button-auth-sign-in"
            >
              Sign in
            </Button>
            <Button
              onClick={() => navigate("/register")}
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
