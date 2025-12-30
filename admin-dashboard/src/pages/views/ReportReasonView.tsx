import { Card, Space, Table, Typography } from "antd";

const { Title } = Typography;

const ReportReasonView: React.FC = () => {
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

export default ReportReasonView;

