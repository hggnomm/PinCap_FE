import { Card, Space, Table, Typography } from "antd";

const { Title } = Typography;

const AlbumManagementView: React.FC = () => {
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

export default AlbumManagementView;

