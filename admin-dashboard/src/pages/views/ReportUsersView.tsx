import { Card, Space, Table, Typography } from "antd";

const { Title } = Typography;

const ReportUsersView: React.FC = () => {
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

export default ReportUsersView;

