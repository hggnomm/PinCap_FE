import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { DownOutlined } from "@ant-design/icons";

import { Avatar, Button, Col, Dropdown, Row, Space, Tooltip } from "antd";

import { LogoIcon, TextIcon } from "@/assets/img";
import iconChatbot from "@/assets/img/PinCap/chatbot.png";
import Notification from "@/components/Notification";
import { ROUTES } from "@/constants/routes";
import { useInitializeNotifications } from "@/hooks/useInitializeNotifications";
import { useAuth } from "@/react-query/useAuth";
import { toggleChatbot } from "@/store/chatSlice";

import HeaderSearchBar from "./HeaderSearchBar";
import SearchDrawer from "./SearchDrawer";
import "./index.less";

const HeaderCommon = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);

  useInitializeNotifications(isAuthenticated);

  useEffect(() => {
    if (location.pathname === ROUTES.SEARCH) {
      setIsSearchDrawerOpen(false);
      setShowImageSearch(false);
    }
  }, [location.pathname]);

  // Toggle chatbot visibility using Redux
  const handleToggleChatbot = () => {
    dispatch(toggleChatbot());
  };

  // Handle user logout
  const logoutHandle = () => {
    logout();
  };

  // Handle search drawer
  const handleCloseSearchDrawer = () => {
    setIsSearchDrawerOpen(false);
    setShowImageSearch(false);
  };

  const handleSearchDrawerOpen = () => {
    setIsSearchDrawerOpen(true);
  };

  const handleImageSearchOpen = () => {
    setShowImageSearch(true);
    setIsSearchDrawerOpen(true);
  };

  const menuItems = [
    {
      key: "1",
      label: (
        <div
          className="p-2 min-w-48 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
          onClick={() => navigate(ROUTES.PROFILE)}
        >
          <div className="font-bold text-gray-900">
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.first_name || user?.last_name}
          </div>
          <div className="text-gray-600">
            {user?.email || "user@example.com"}
          </div>
        </div>
      ),
    },
    { type: "divider" as const },
    {
      key: "3",
      label: (
        <Button
          className="w-full text-left text-gray-900 hover:text-gray-700"
          onClick={logoutHandle}
          type="link"
        >
          Sign out
        </Button>
      ),
    },
  ];

  // Remove this line as we now use isAuthenticated from useAuth hook

  return (
    <Row className="main-header !z-50">
      <Col
        className="left-header"
        onClick={() =>
          navigate(isAuthenticated ? ROUTES.PINCAP_HOME : ROUTES.LOGIN)
        }
      >
        <img className="logo-icon" src={LogoIcon} alt="Logo" />
        {isAuthenticated && (
          <img className="text-icon" src={TextIcon} alt="Text" />
        )}
      </Col>

      {/* Middle Search Bar */}
      {isAuthenticated && (
        <Col className="middle-header">
          <HeaderSearchBar
            onSearchDrawerOpen={handleSearchDrawerOpen}
            onImageSearchOpen={handleImageSearchOpen}
            onSearchDrawerClose={handleCloseSearchDrawer}
          />
        </Col>
      )}

      <Col className="right-header">
        {isAuthenticated && (
          <Col
            className="action-header !gap-3"
            xs={{ span: 16 }}
            lg={{ span: 9 }}
          >
            <Tooltip title="Pinbot: Virtual Assistant" placement="bottom">
              <div
                className="chatbot-btn"
                onClick={handleToggleChatbot}
                style={{
                  backgroundImage: `url(${iconChatbot})`,
                  backgroundSize: "24px 24px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
            </Tooltip>

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
                    src={
                      user?.avatar ||
                      "https://imagedelivery.net/LBWXYQ-XnKSYxbZ-NuYGqQ/543c6373-55ce-4fb2-b282-dbb0e43c1500/avatarhd"
                    }
                  />
                  <DownOutlined className="text-xs" />
                </Space>
              </Dropdown>
            </Space>
          </Col>
        )}

        {!isAuthenticated && (
          <Col className="action-header" xs={{ span: 16 }} lg={{ span: 9 }}>
            <Button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="button-auth-sign-in"
            >
              Sign in
            </Button>
            <Button
              onClick={() => navigate(ROUTES.REGISTER)}
              className="button-auth-sign-up"
            >
              Sign up
            </Button>
          </Col>
        )}
      </Col>

      {/* Search Drawer */}
      <SearchDrawer
        isOpen={isSearchDrawerOpen}
        onClose={handleCloseSearchDrawer}
        showImageSearch={showImageSearch}
      />
    </Row>
  );
};

export default HeaderCommon;
