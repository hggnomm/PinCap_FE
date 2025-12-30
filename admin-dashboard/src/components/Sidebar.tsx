import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileImageOutlined,
  FolderOutlined,
  FileTextOutlined,
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
      key: "user",
      icon: <UserOutlined />,
      label: "User",
    },
    {
      key: "media",
      icon: <FileImageOutlined />,
      label: "Media",
    },
    {
      key: "album",
      icon: <FolderOutlined />,
      label: "Album",
    },
    {
      key: "report",
      icon: <FileTextOutlined />,
      label: "Report",
      children: [
        {
          key: "report-users",
          label: "Users",
        },
        {
          key: "report-media",
          label: "Media",
        },
        {
          key: "report-reason",
          label: "Reason Report",
        },
      ],
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
