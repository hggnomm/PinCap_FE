import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  CloseCircleFilled,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import {
  Avatar,
  Button,
  Col,
  Dropdown,
  Input,
  Row,
  Space,
  Tooltip,
} from "antd";

import { LogoIcon, TextIcon } from "@/assets/img";
import iconChatbot from "@/assets/img/PinCap/chatbot.png";
import { ROUTES } from "@/constants/routes";
import { useInitializeNotifications } from "@/hooks/useInitializeNotifications";
import { useAuth } from "@/react-query/useAuth";
import { toggleChatbot } from "@/store/chatSlice";

import Notification from "../notification";

import SearchDrawer from "./SearchDrawer";
import "./index.less";

const HeaderCommon = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize notifications when user is authenticated
  useInitializeNotifications(isAuthenticated);

  // Clear search query when navigating to home
  useEffect(() => {
    if (location.pathname === ROUTES.PINCAP_HOME) {
      setSearchQuery("");
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
  const handleSearchClick = () => {
    setIsSearchDrawerOpen(true);
  };

  const handleCloseSearchDrawer = () => {
    setIsSearchDrawerOpen(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleHeaderSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchEnter = () => {
    if (searchQuery.trim()) {
      navigate(
        `${ROUTES.SEARCH}?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setIsSearchDrawerOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
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
          <div className="search-bar">
            <Input
              placeholder="Search..."
              suffix={
                searchQuery ? (
                  <CloseCircleFilled
                    onClick={handleClearSearch}
                    className="cursor-pointer transition-colors"
                    style={{
                      fontSize: "18px",
                      color: "#a25772",
                    }}
                  />
                ) : (
                  <SearchOutlined
                    style={{
                      fontSize: "18px",
                      color: "#a25772",
                    }}
                  />
                )
              }
              value={searchQuery}
              onChange={handleHeaderSearchChange}
              onFocus={handleSearchClick}
              onPressEnter={handleSearchEnter}
              className="cursor-pointer header-search-input"
            />
          </div>
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
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />
    </Row>
  );
};

export default HeaderCommon;
