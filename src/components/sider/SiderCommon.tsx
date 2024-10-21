import {
  DashboardOutlined,
  PlusOutlined,
  ProductOutlined,
  SignatureOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./index.less";
import iconAI from "../../assets/img/PinCap/ai-technology-img.png";
import styled from "styled-components";

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

  &:hover {
    background: linear-gradient(#fff, #fff) padding-box,
      linear-gradient(60deg, #ff00ff, #00c0ff) border-box;
    cursor: pointer;
  }
`;

const SiderCommon = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(true);
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

  return (
    <Sider
      collapsible={true}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="siderbar"
      width="16%"
      trigger={isMobile ? null : undefined}
    >
      <Menu mode="inline" style={{ padding: "0.5rem" }}>
        <CreateMediaBtn key="1" icon={<PlusOutlined />}>
          <Link to="/create-media">Create Media</Link>
        </CreateMediaBtn>
        <Menu.Item key="2" icon={<SignatureOutlined />}>
          <Link to="/album">My Album</Link>
        </Menu.Item>
        <Menu.SubMenu
          key="my-media"
          icon={<ProductOutlined />}
          title="My Media"
        >
          
          <Menu.Item key="images">Images</Menu.Item>
          <Menu.Item key="videos">Videos</Menu.Item>
        </Menu.SubMenu>
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
        <AIToolBtn key="3" title={null}>
          <img
            src={iconAI}
            alt="AI Tool"
            style={{ width: "16px", marginRight: "1.5rem" }}
          />
          <Link to="/ai">AI Tool</Link>
        </AIToolBtn>
      </Menu>
      <Outlet />
    </Sider>
  );
};

export default SiderCommon;
