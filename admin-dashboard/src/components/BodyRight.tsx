import { Card, Row, Col, Statistic, Typography, Space, Table } from "antd";
import {
  UserOutlined,
  FileImageOutlined,
  FolderOutlined,
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
                title="Total Media"
                value={9324}
                prefix={<FileImageOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Total Albums"
                value={1128}
                prefix={<FolderOutlined />}
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

  const renderUser = () => {
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
        <Title level={2}>User Management</Title>
        <Card>
          <Table columns={columns} dataSource={[]} />
        </Card>
      </Space>
    );
  };

  const renderMedia = () => {
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
        title: "Type",
        dataIndex: "type",
        key: "type",
      },
    ];

    return (
      <Space vertical size="large" style={{ width: "100%", padding: 24 }}>
        <Title level={2}>Media Management</Title>
        <Card>
          <Table columns={columns} dataSource={[]} />
        </Card>
      </Space>
    );
  };

  const renderAlbum = () => {
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
        title: "Media Count",
        dataIndex: "mediaCount",
        key: "mediaCount",
      },
    ];

    return (
      <Space vertical size="large" style={{ width: "100%", padding: 24 }}>
        <Title level={2}>Album Management</Title>
        <Card>
          <Table columns={columns} dataSource={[]} />
        </Card>
      </Space>
    );
  };

  const renderReportMedia = () => {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Media ID",
        dataIndex: "mediaId",
        key: "mediaId",
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
      },
    ];

    return (
      <Space vertical size="large" style={{ width: "100%", padding: 24 }}>
        <Title level={2}>Report - Media</Title>
        <Card>
          <Table columns={columns} dataSource={[]} />
        </Card>
      </Space>
    );
  };

  const renderReportUsers = () => {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "User ID",
        dataIndex: "userId",
        key: "userId",
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
      },
    ];

    return (
      <Space vertical size="large" style={{ width: "100%", padding: 24 }}>
        <Title level={2}>Report - Users</Title>
        <Card>
          <Table columns={columns} dataSource={[]} />
        </Card>
      </Space>
    );
  };

  const renderReportReason = () => {
    const columns = [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Reason",
        dataIndex: "reason",
        key: "reason",
      },
      {
        title: "Count",
        dataIndex: "count",
        key: "count",
      },
    ];

    return (
      <Space vertical size="large" style={{ width: "100%", padding: 24 }}>
        <Title level={2}>Report - Reason Report</Title>
        <Card>
          <Table columns={columns} dataSource={[]} />
        </Card>
      </Space>
    );
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "dashboard":
        return renderDashboard();
      case "user":
        return renderUser();
      case "media":
        return renderMedia();
      case "album":
        return renderAlbum();
      case "report-media":
        return renderReportMedia();
      case "report-users":
        return renderReportUsers();
      case "report-reason":
        return renderReportReason();
      default:
        return renderDashboard();
    }
  };

  return <>{renderContent()}</>;
};

export default BodyRight;
