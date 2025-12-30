import { Card, Space, Table, Typography } from "antd";

const { Title } = Typography;

const ReportMediaView: React.FC = () => {
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

export default ReportMediaView;

