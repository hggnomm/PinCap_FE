import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";

import { styled } from "styled-components";

import {
  DashboardOutlined,
  PlusOutlined,
  ProductOutlined,
  SignatureOutlined,
} from "@ant-design/icons";

import Sider from "antd/es/layout/Sider";

import { Menu } from "antd";

import "./index.less";
import iconAI from "@/assets/img/PinCap/ai-technology-img.png";
import iconPinBot from "@/assets/img/PinCap/chatbot.png";
import { toggleChatbot } from "@/store/chatSlice";
import { TokenPayload } from "@/types/Auth";

const CreateMediaBtn = styled(Menu.Item)`
  background-color: #a25772;
  color: #fff !important;

  &:hover {
    background-color: #902a55 !important;
    opacity: 0.9 !important;
  }

  &.ant-menu-item-selected {
    background-color: #902a55 !important;
    color: #fff !important;
  }

  a {
    color: #fff !important;
  }

  transition: background-color 0.3s ease, opacity 0.3s ease;
`;

const AIToolBtn = styled(Menu.Item)`
  background: linear-gradient(#fff, #fff) padding-box,
    linear-gradient(60deg, #00f, #00e8ff, #ff00ff) border-box;
  color: #000 !important;
  border-radius: 16px !important;
  border: 2px solid transparent;
  justify-content: start;
  transition: background 0.3s ease;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 0;

  &:hover {
    background: linear-gradient(#fff, #fff) padding-box,
      linear-gradient(60deg, #ff00ff, #00c0ff) border-box;
    cursor: pointer;
  }
`;
const SiderCommon = () => {
  const dispatch = useDispatch();
  const tokenPayload = useSelector(
    (state: { auth: TokenPayload }) => state.auth
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const location = useLocation();

  const getSelectedKeys = () => {
    const pathname = location.pathname;

    if (pathname === "/create-media") return ["create-media"];
    if (pathname === "/album") return ["album"];
    if (pathname === "/my-media") return ["my-media"];

    if (pathname === "/ai") return ["ai-tool"];
    if (pathname.startsWith("/dashboard")) {
      if (pathname === "/dashboard") return ["dashHome"];
      if (pathname === "/dashboard/album") return ["dashAlbum"];
      if (pathname === "/dashboard/mediaReport") return ["dashMediaReport"];
    }
    return [];
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setCollapsed(true);
      } else {
        setIsMobile(false);
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleChatbot = () => {
    dispatch(toggleChatbot());
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="siderbar"
      width={isMobile ? "80px" : "240px"}
      trigger={isMobile ? null : undefined}
      style={{
        overflow: "auto",
        minHeight: "100vh",
      }}
    >
      <Menu selectedKeys={getSelectedKeys()} mode="inline">
        {/* Create Media Button */}
        <CreateMediaBtn key="create-media" icon={<PlusOutlined />}>
          <Link to="/create-media">Create Media</Link>
        </CreateMediaBtn>

        {/* My Media Menu Item */}

        <Menu.Item key="my-media" icon={<ProductOutlined />}>
          <Link to="/my-media">My Media</Link>
        </Menu.Item>

        {/* Album Menu Item */}
        <Menu.Item key="album" icon={<SignatureOutlined />}>
          <Link to="/album">My Album</Link>
        </Menu.Item>

        {/* AI Tool Button */}

        <AIToolBtn
          key="ai-tool"
          icon={
            <img
              src={iconAI}
              alt="AI Tool"
              style={{ width: "16px", height: "16px" }}
            />
          }
        >
          <Link to="/ai">AI Tool</Link>
        </AIToolBtn>

        <AIToolBtn
          key="PinBot"
          icon={
            <img
              src={iconPinBot}
              alt="PinBot"
              style={{ width: "16px", height: "16px" }}
            />
          }
          onClick={handleToggleChatbot}
        >
          <span style={{ cursor: "pointer" }}>PinBot</span>
        </AIToolBtn>

        {/* Dashboard Submenu */}
        {/* {tokenPayload.role === "ADMIN" && ( */}
        <Menu.SubMenu
          key="dashboard"
          icon={<DashboardOutlined />}
          title="Dashboard"
        >
          <Menu.Item key="dashHome">
            <Link to="/dashboard">Home</Link>
          </Menu.Item>
          <Menu.Item key="dashAlbum">
            <Link to="/dashboard/album">Album</Link>
          </Menu.Item>
          <Menu.Item key="dashMediaReport">
            <Link to="/dashboard/mediaReport">Media Report</Link>
          </Menu.Item>
        </Menu.SubMenu>
        {/* )} */}
      </Menu>
      <Outlet />
    </Sider>
  );
};

export default SiderCommon;
