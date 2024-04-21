import { VideoCameraOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import MenuItem from "antd/es/menu/MenuItem";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./index.less";

const SiderCommon = () => {
  return (
    <Sider collapsible className="siderbar" width="15%">
      <Menu theme="dark" mode="inline">
        <Menu.Item key="1" icon={<VideoCameraOutlined />}>
          <Link to="/create-media">Create Media</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<VideoCameraOutlined />}>
          <Link to="/album">My Album</Link>
        </Menu.Item>
        <Menu.SubMenu
          mode="inline"
          title="My Media"
          defaultSelectedKeys={["1"]}
        >
          <Menu.Item key="images">Images</Menu.Item>
          <Menu.Item key="videos">Videos</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          mode="inline"
          title="Dashboard"
          defaultSelectedKeys={["1"]}
        >
          <Menu.Item key="dashHome" icon={<VideoCameraOutlined />}>
            <Link to="/dashboard">Home</Link>
          </Menu.Item>
          <Menu.Item key="dashAlbum" icon={<VideoCameraOutlined />}>
            <Link to="/dashboard/album">Album</Link>
          </Menu.Item>
          <Menu.Item key="dashMediaReport" icon={<VideoCameraOutlined />}>
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
