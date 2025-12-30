import { useLocation, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { message } from "antd";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BodyRight from "@/components/BodyRight";
import { ROUTES } from "@/constants/routes";
import { logout } from "@/api/auth";

const { Content } = Layout;

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      message.success("Logout successful!");
      navigate(ROUTES.LOGIN);
    } catch (error: unknown) {
      // Even if API call fails, still logout locally
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Logout failed";
      message.error(errorMessage);
      localStorage.removeItem("token");
      navigate(ROUTES.LOGIN);
    }
  };

  // Get current route key from pathname
  const getSelectedKey = (): string => {
    const path = location.pathname;
    if (path === ROUTES.DASHBOARD || path === "/") return "dashboard";
    if (path === ROUTES.USER_MANAGEMENT) return "user";
    if (path === ROUTES.MEDIA_MANAGEMENT) return "media";
    if (path === ROUTES.ALBUM_MANAGEMENT) return "album";
    if (path === ROUTES.REPORT_USERS) return "report-users";
    if (path === ROUTES.REPORT_MEDIA) return "report-media";
    if (path === ROUTES.REPORT_REASON) return "report-reason";
    return "dashboard";
  };

  return (
    <Layout>
      <Sidebar selectedKey={getSelectedKey()} />
      <Layout>
        <Header onLogout={handleLogout} />
        <Content>
          <BodyRight />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
