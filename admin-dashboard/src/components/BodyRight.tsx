import { Card, Row, Col, Statistic, Typography, Space, Table } from "antd";
import {
  UserOutlined,
  FileOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

interface BodyRightProps {
  selectedKey: string;
}

const BodyRight: React.FC<BodyRightProps> = ({ selectedKey }) => {
  const renderDashboard = () => {
    return (
      <Space vertical size="large" style={{ width: "100%", padding: 24 }}>
        <Title level={2}>Dashboard Overview</Title>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Total Users"
                value={1128}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Total Files"
                value={9324}
                prefix={<FileOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Database Size"
                value={1128}
                prefix={<DatabaseOutlined />}
                suffix="MB"
              />
            </Card>
          </Col>
        </Row>

        <Card>
          <Title level={4}>Welcome to Admin Dashboard</Title>
          <p>
            You are successfully authenticated and can now manage the system.
          </p>
        </Card>
      </Space>
    );
  };

  const renderUsers = () => {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
    ];

    return (
      <Space vertical size="large" style={{ width: "100%", padding: 24 }}>
        <Title level={2}>Users Management</Title>
        <Card>
          <Table columns={columns} dataSource={[]} />
        </Card>
      </Space>
    );
  };

  const renderFiles = () => {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Size",
        dataIndex: "size",
        key: "size",
      },
    ];

    return (
      <Space vertical size="large" style={{ width: "100%", padding: 24 }}>
        <Title level={2}>Files Management</Title>
        <Card>
          <Table columns={columns} dataSource={[]} />
        </Card>
      </Space>
    );
  };

  const renderSettings = () => {
    return (
      <Space vertical size="large" style={{ width: "100%", padding: 24 }}>
        <Title level={2}>Settings</Title>
        <Card>
          <Title level={4}>System Settings</Title>
          <p>Configure your system settings here.</p>
        </Card>
      </Space>
    );
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return renderUsers();
      case "files":
        return renderFiles();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return <>{renderContent()}</>;
};

export default BodyRight;

