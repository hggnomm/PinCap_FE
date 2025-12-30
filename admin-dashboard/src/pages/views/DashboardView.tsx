import { Card, Row, Col, Statistic, Typography, Space } from "antd";
import {
  UserOutlined,
  FileImageOutlined,
  FolderOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const DashboardView: React.FC = () => {
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

export default DashboardView;

