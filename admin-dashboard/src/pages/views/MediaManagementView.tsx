import { useState, useEffect } from "react";
import {
  Card,
  Space,
  Table,
  Typography,
  Button,
  Input,
  Select,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Flex,
  Image,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
  PlusOutlined,
  SearchOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import type { AdminMedia, GetMediasParams, UpdateMediaData } from "@/api/media";
import {
  getMedias,
  updateMedia,
  deleteMedia,
  restoreMedia,
  createMedia,
} from "@/api/media";

const { Title } = Typography;
const { Option } = Select;

interface EditMediaFormData {
  media_name: string;
  media_url: string;
  media_type?: string | null;
  description?: string | null;
  privacy?: string | null;
}

const MediaManagementView: React.FC = () => {
  const [medias, setMedias] = useState<AdminMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<GetMediasParams>({
    page: 1,
    per_page: 10,
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingMedia, setEditingMedia] = useState<AdminMedia | null>(null);
  const [form] = Form.useForm();

  const fetchMedias = async (calculateTotal = false) => {
    setLoading(true);
    try {
      const response = await getMedias(searchParams);
      setMedias(response.data);

      // Use total from API response if available
      if (response.total !== undefined) {
        setPagination((prev) => ({
          ...prev,
          total: response.total || 0,
        }));
      } else if (calculateTotal || pagination.total === 0) {
        // Calculate total by fetching with large per_page to count all
        try {
          const countResponse = await getMedias({
            ...searchParams,
            page: 1,
            per_page: 1000,
          });
          const totalCount = countResponse.data.length;

          setPagination((prev) => ({
            ...prev,
            total: totalCount,
          }));
        } catch {
          // Fallback: calculate based on current page
          const currentPage = searchParams.page || 1;
          const perPage = searchParams.per_page || 10;
          const dataLength = response.data.length;

          let total = 0;
          if (dataLength === 0) {
            total = 0;
          } else if (dataLength < perPage) {
            total = (currentPage - 1) * perPage + dataLength;
          } else {
            total = currentPage * perPage + 1;
          }

          setPagination((prev) => ({
            ...prev,
            total: total,
          }));
        }
      } else {
        // Update total based on current page data
        const currentPage = searchParams.page || 1;
        const perPage = searchParams.per_page || 10;
        const dataLength = response.data.length;

        if (dataLength === 0) {
          setPagination((prev) => ({
            ...prev,
            total: (currentPage - 1) * perPage,
          }));
        } else if (dataLength < perPage) {
          setPagination((prev) => ({
            ...prev,
            total: (currentPage - 1) * perPage + dataLength,
          }));
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to fetch medias. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasFilters = Boolean(
      searchParams.media_name ||
        searchParams.media_type ||
        searchParams.deleted_at ||
        searchParams.user_id ||
        searchParams.album_id
    );

    fetchMedias(pagination.total === 0 || hasFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTableChange = (newPagination: {
    current?: number;
    pageSize?: number;
  }) => {
    if (newPagination.current) {
      setPagination((prev) => ({
        ...prev,
        current: newPagination.current || 1,
        pageSize: newPagination.pageSize || 10,
      }));
      setSearchParams((prev) => ({
        ...prev,
        page: newPagination.current || 1,
        per_page: newPagination.pageSize || 10,
      }));
    }
  };

  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      media_name: value || undefined,
      page: 1,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleFilterType = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      media_type: value || undefined,
      page: 1,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleFilterDeleted = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      deleted_at: value as "null" | "not_null" | undefined,
      page: 1,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleClearFilters = () => {
    const defaultParams: GetMediasParams = {
      page: 1,
      per_page: 10,
    };
    setSearchParams(defaultParams);
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0,
    });
  };

  const handleEdit = (media: AdminMedia) => {
    setEditingMedia(media);
    form.setFieldsValue({
      media_name: media.media_name,
      media_url: media.media_url,
      media_type: media.media_type || "",
      description: media.description || "",
      privacy: media.privacy || "",
    });
    setIsEditModalVisible(true);
  };

  const handleCreate = () => {
    form.resetFields();
    setEditingMedia(null);
    setIsCreateModalVisible(true);
  };

  const handleEditSubmit = async (values: EditMediaFormData) => {
    if (!editingMedia) return;

    try {
      const updateData: UpdateMediaData = {
        media_name: values.media_name,
        media_url: values.media_url,
        media_type: values.media_type || null,
        description: values.description || null,
        privacy: values.privacy || null,
      };

      await updateMedia(editingMedia.id, updateData);
      message.success("Media updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      fetchMedias();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to update media";
      message.error(errorMessage);
    }
  };

  const handleCreateSubmit = async (
    values: EditMediaFormData & { user_id: string }
  ) => {
    try {
      await createMedia({
        media_name: values.media_name,
        media_url: values.media_url,
        media_type: values.media_type || null,
        user_id: values.user_id,
        description: values.description || null,
        privacy: values.privacy || null,
      });
      message.success("Media created successfully");
      setIsCreateModalVisible(false);
      form.resetFields();
      fetchMedias();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to create media";
      message.error(errorMessage);
    }
  };

  const handleDelete = async (mediaId: string) => {
    try {
      await deleteMedia(mediaId);
      message.success("Media deleted successfully");
      fetchMedias();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to delete media";
      message.error(errorMessage);
    }
  };

  const handleRestore = async (mediaId: string) => {
    try {
      await restoreMedia(mediaId);
      message.success("Media restored successfully");
      fetchMedias();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to restore media";
      message.error(errorMessage);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Preview",
      key: "preview",
      width: 100,
      render: (_: unknown, record: AdminMedia) => {
        const isImage =
          record.media_type?.includes("image") ||
          record.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
        if (isImage) {
          return (
            <Image
              src={record.media_url}
              alt={record.media_name}
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
              preview={false}
            />
          );
        }
        return <Tag>Media</Tag>;
      },
    },
    {
      title: "Name",
      dataIndex: "media_name",
      key: "media_name",
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "media_type",
      key: "media_type",
      render: (type: string | null) => type || "-",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "deleted_at",
      key: "status",
      render: (deletedAt: string | null) => (
        <Tag color={deletedAt ? "red" : "green"}>
          {deletedAt ? "Deleted" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: AdminMedia) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={!!record.deleted_at}
          >
            Edit
          </Button>
          {record.deleted_at ? (
            <Popconfirm
              title="Are you sure you want to restore this media?"
              onConfirm={() => handleRestore(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" icon={<UndoOutlined />}>
                Restore
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to delete this media?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", padding: 24 }}
    >
      <Flex justify="space-between" align="center">
        <Title level={2}>Media Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Media
        </Button>
      </Flex>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space>
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 300 }}
              value={searchParams.media_name || ""}
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearch("");
                }
              }}
            />
            <Select
              placeholder="Filter by type"
              allowClear
              style={{ width: 150 }}
              value={searchParams.media_type}
              onChange={handleFilterType}
            >
              <Option value="image">Image</Option>
              <Option value="video">Video</Option>
              <Option value="audio">Audio</Option>
            </Select>
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 150 }}
              value={searchParams.deleted_at}
              onChange={handleFilterDeleted}
            >
              <Option value="null">Active</Option>
              <Option value="not_null">Deleted</Option>
            </Select>
            <Button
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
              disabled={
                !searchParams.media_name &&
                !searchParams.media_type &&
                !searchParams.deleted_at &&
                !searchParams.user_id &&
                !searchParams.album_id
              }
            >
              Clear Filters
            </Button>
          </Space>
        </Space>

        <Table
          columns={columns}
          dataSource={medias}
          loading={loading}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} medias`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Media"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="media_name"
            label="Media Name"
            rules={[{ required: true, message: "Please enter media name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="media_url"
            label="Media URL"
            rules={[{ required: true, message: "Please enter media URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="media_type" label="Media Type">
            <Select placeholder="Select media type">
              <Option value="image">Image</Option>
              <Option value="video">Video</Option>
              <Option value="audio">Audio</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="privacy" label="Privacy">
            <Select placeholder="Select privacy">
              <Option value="PUBLIC">Public</Option>
              <Option value="PRIVATE">Private</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Modal */}
      <Modal
        title="Create Media"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
          <Form.Item
            name="media_name"
            label="Media Name"
            rules={[{ required: true, message: "Please enter media name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="media_url"
            label="Media URL"
            rules={[{ required: true, message: "Please enter media URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="user_id"
            label="User ID"
            rules={[{ required: true, message: "Please enter user ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="media_type" label="Media Type">
            <Select placeholder="Select media type">
              <Option value="image">Image</Option>
              <Option value="video">Video</Option>
              <Option value="audio">Audio</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="privacy" label="Privacy">
            <Select placeholder="Select privacy">
              <Option value="PUBLIC">Public</Option>
              <Option value="PRIVATE">Private</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default MediaManagementView;
