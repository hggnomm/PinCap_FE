import { useState } from "react";
import { Layout, Typography, Button, Space, message } from "antd";
import { logout } from "@/api/auth";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      message.success("Logout successful!");
      onLogout();
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || "Logout failed";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AntHeader style={{ background: "#fff", padding: "0 24px" }}>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Title level={3} style={{ margin: 0 }}>
          PinCap Admin Dashboard
        </Title>
        <Button onClick={handleLogout} type="default" loading={loading}>
          Logout
        </Button>
      </Space>
    </AntHeader>
  );
};

export default Header;
