import { AppstoreAddOutlined, PlusOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./index.less";

const SiderCommon = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Sider collapsible={!isMobile} className="siderbar" width="13%">
      <Menu mode="inline">
        <Menu.Item key="1" icon={<PlusOutlined />}>
          <Link to="/create-media">Create Media</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          <Link to="/album">My Album</Link>
        </Menu.Item>
        <Menu.SubMenu icon={<VideoCameraOutlined />} title="My Media">
          <Menu.Item key="images">Images</Menu.Item>
          <Menu.Item key="videos">Videos</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu icon={<VideoCameraOutlined />} title="Dashboard">
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
        <Menu.Item key="3" icon={<VideoCameraOutlined />}>
          <Link to="/ai">AI Tool</Link>
        </Menu.Item>
      </Menu>
      <Outlet />
    </Sider>
  );
};

export default SiderCommon;
