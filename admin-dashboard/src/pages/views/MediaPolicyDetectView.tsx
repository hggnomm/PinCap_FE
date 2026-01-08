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
  SearchOutlined,
  ClearOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import type { AdminMedia, GetMediasParams, UpdateMediaData } from "@/api/media";
import { getMedias, updateMedia, deleteMedia, restoreMedia } from "@/api/media";

const { Title } = Typography;
const { Option } = Select;

interface EditMediaFormData {
  media_name: string;
  media_url: string;
  media_type?: string | null;
  description?: string | null;
  privacy?: string | null;
}

const MediaPolicyDetectView: React.FC = () => {
  const [medias, setMedias] = useState<AdminMedia[]>([]);
  const [loading, setLoading] = useState(false);

  // Get base URL based on environment
  const getBaseUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3000";
    }
    return (
      import.meta.env.VITE_PINCAP_DOMAIN || "https://pin-cap-fe.vercel.app"
    );
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<GetMediasParams>({
    page: 1,
    per_page: 10,
    is_policy_violation: 1, // Default filter for policy violations
  });
  const [searchInput, setSearchInput] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
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
      media_type: value ? value.toUpperCase() : undefined,
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
      is_policy_violation: 1, // Keep policy violation filter (1 = true)
    };
    setSearchParams(defaultParams);
    setSearchInput("");
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0,
    });
  };

  const handleEdit = (media: AdminMedia) => {
    console.log("Editing media:", media);
    setEditingMedia(media);
    const mediaUrl = Array.isArray(media.media_url)
      ? media.media_url[0]
      : media.media_url;
    const mediaType = media.type || media.media_type || "";
    const formValues = {
      media_name: media.media_name || "",
      media_url: typeof mediaUrl === "string" ? mediaUrl : "",
      media_type: mediaType,
      description: media.description || "",
      privacy: media.privacy || "",
    };
    console.log("Setting form values:", formValues);
    form.setFieldsValue(formValues);
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values: EditMediaFormData) => {
    if (!editingMedia) {
      message.error("No media selected for editing");
      return;
    }

    try {
      const updateData: UpdateMediaData = {
        media_name: values.media_name,
        media_url: values.media_url,
        media_type: editingMedia.type || editingMedia.media_type || null,
        description: values.description || null,
        privacy: values.privacy || null,
      };

      console.log("Updating media:", editingMedia.id, updateData);
      await updateMedia(editingMedia.id, updateData);
      message.success("Media updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      fetchMedias();
    } catch (error: unknown) {
      console.error("Error updating media:", error);
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to update media"
          : "Failed to update media";
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
      key: "id",
      width: 300,
      render: (_: unknown, record: AdminMedia) => {
        const baseUrl = getBaseUrl();
        const mediaLink = `${baseUrl}/media/${record.id}`;
        return (
          <a
            href={mediaLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ wordBreak: "break-all" }}
          >
            {record.id}
          </a>
        );
      },
    },
    {
      title: "Preview",
      key: "preview",
      width: 100,
      render: (_: unknown, record: AdminMedia) => {
        const mediaType = record.type || record.media_type;
        const isImage =
          mediaType === "IMAGE" || mediaType?.toLowerCase() === "image";

        // Get first URL if media_url is array
        const mediaUrl = Array.isArray(record.media_url)
          ? record.media_url[0]
          : record.media_url;

        // Check if URL is image by extension
        const isImageByUrl =
          mediaUrl &&
          typeof mediaUrl === "string" &&
          mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);

        if (
          (isImage || isImageByUrl) &&
          mediaUrl &&
          typeof mediaUrl === "string"
        ) {
          return (
            <Image
              src={mediaUrl}
              alt={record.media_name || "Media"}
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
      render: (name: string | null) => name || "-",
    },
    {
      title: "Type",
      key: "type",
      render: (_: unknown, record: AdminMedia) => {
        const type = record.type || record.media_type;
        return type ? type.toUpperCase() : "-";
      },
    },
    {
      title: "User",
      key: "user",
      render: (_: unknown, record: AdminMedia) => {
        if (record.user_owner) {
          return `${record.user_owner.first_name} ${record.user_owner.last_name}`;
        }
        const userId = record.media_owner_id || record.user_id;
        return userId || "-";
      },
    },
    {
      title: "Policy Violation",
      key: "policy_violation",
      render: () => (
        <Tag color="red" icon={<WarningOutlined />}>
          Violation Detected
        </Tag>
      ),
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
      width: 90,
      render: (_: unknown, record: AdminMedia) => (
        <Space size={0}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit"
            size="small"
          />
          {record.deleted_at ? (
            <Popconfirm
              title="Are you sure you want to restore this media?"
              onConfirm={() => handleRestore(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                icon={<UndoOutlined />}
                title="Restore"
                size="small"
              />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Are you sure you want to delete this media?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                title="Delete"
                size="small"
              />
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
        <Title level={2}>
          <WarningOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
          Media Policy Detect
        </Title>
      </Flex>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space>
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 300 }}
              value={searchInput}
              onPressEnter={(e) => {
                handleSearch(e.currentTarget.value);
              }}
              onChange={(e) => {
                const value = e.target.value;
                setSearchInput(value);
                if (!value) {
                  handleSearch("");
                }
              }}
            />
            <Select
              placeholder="Filter by type"
              allowClear
              style={{ width: 150 }}
              value={searchParams.media_type?.toLowerCase()}
              onChange={handleFilterType}
            >
              <Option value="IMAGE">Image</Option>
              <Option value="VIDEO">Video</Option>
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
          scroll={{ x: "max-content" }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} policy violations`,
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
            <Input
              disabled
              value={editingMedia?.type || editingMedia?.media_type || "-"}
            />
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

export default MediaPolicyDetectView;
