import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

interface SidebarProps {
  selectedKey: string;
  onMenuChange: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedKey, onMenuChange }) => {
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
    },
    {
      key: "files",
      icon: <FileOutlined />,
      label: "Files",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    onMenuChange(key);
  };

  return (
    <Sider width={200} theme="light">
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
