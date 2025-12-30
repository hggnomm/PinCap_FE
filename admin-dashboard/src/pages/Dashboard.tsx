import { useState } from "react";
import { Layout } from "antd";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import BodyRight from "@/components/BodyRight";

const { Content } = Layout;

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [selectedKey, setSelectedKey] = useState<string>("dashboard");

  const handleMenuChange = (key: string) => {
    setSelectedKey(key);
  };

  return (
    <Layout>
      <Sidebar selectedKey={selectedKey} onMenuChange={handleMenuChange} />
      <Layout>
        <Header onLogout={onLogout} />
        <Content>
          <BodyRight selectedKey={selectedKey} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
