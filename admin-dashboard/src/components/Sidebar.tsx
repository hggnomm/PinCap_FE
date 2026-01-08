import { useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileImageOutlined,
  FolderOutlined,
  FileTextOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { ROUTES } from "@/constants/routes";

const { Sider } = Layout;

interface SidebarProps {
  selectedKey: string;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedKey }) => {
  const navigate = useNavigate();

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
      key: "media-policy-detect",
      icon: <WarningOutlined />,
      label: "Media Policy Detect",
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
    switch (key) {
      case "dashboard":
        navigate(ROUTES.DASHBOARD);
        break;
      case "user":
        navigate(ROUTES.USER_MANAGEMENT);
        break;
      case "media":
        navigate(ROUTES.MEDIA_MANAGEMENT);
        break;
      case "media-policy-detect":
        navigate(ROUTES.MEDIA_POLICY_DETECT);
        break;
      case "album":
        navigate(ROUTES.ALBUM_MANAGEMENT);
        break;
      case "report-users":
        navigate(ROUTES.REPORT_USERS);
        break;
      case "report-media":
        navigate(ROUTES.REPORT_MEDIA);
        break;
      case "report-reason":
        navigate(ROUTES.REPORT_REASON);
        break;
      default:
        break;
    }
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
