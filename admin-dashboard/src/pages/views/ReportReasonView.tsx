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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UndoOutlined,
  PlusOutlined,
  SearchOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import type {
  AdminReportReason,
  GetReportReasonsParams,
  CreateReportReasonData,
  UpdateReportReasonData,
} from "@/api/reportReasons";
import {
  getReportReasons,
  createReportReason,
  updateReportReason,
  deleteReportReason,
  restoreReportReason,
  forceDeleteReportReason,
} from "@/api/reportReasons";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface EditReasonFormData {
  title: string;
  description: string;
}

const ReportReasonView: React.FC = () => {
  const [reasons, setReasons] = useState<AdminReportReason[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<GetReportReasonsParams>({
    page: 1,
    per_page: 10,
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingReason, setEditingReason] = useState<AdminReportReason | null>(
    null
  );
  const [form] = Form.useForm();

  const fetchReasons = async (calculateTotal = false) => {
    setLoading(true);
    try {
      const response = await getReportReasons(searchParams);
      setReasons(response.data);

      if (response.data.length === 0 && pagination.total === 0) {
        setPagination((prev) => ({
          ...prev,
          total: 0,
        }));
      } else if (calculateTotal || pagination.total === 0) {
        try {
          const countResponse = await getReportReasons({
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
          : "Failed to fetch report reasons. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasFilters = Boolean(searchParams.title || searchParams.deleted_at);

    fetchReasons(pagination.total === 0 || hasFilters);
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
      title: value || undefined,
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
    const defaultParams: GetReportReasonsParams = {
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

  const handleEdit = (reason: AdminReportReason) => {
    setEditingReason(reason);
    form.setFieldsValue({
      title: reason.title,
      description: reason.description,
    });
    setIsEditModalVisible(true);
  };

  const handleCreate = () => {
    form.resetFields();
    setEditingReason(null);
    setIsCreateModalVisible(true);
  };

  const handleEditSubmit = async (values: EditReasonFormData) => {
    if (!editingReason) return;

    try {
      const updateData: UpdateReportReasonData = {
        title: values.title,
        description: values.description,
      };

      await updateReportReason(editingReason.id, updateData);
      message.success("Report reason updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      fetchReasons();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to update report reason";
      message.error(errorMessage);
    }
  };

  const handleCreateSubmit = async (values: EditReasonFormData) => {
    try {
      const createData: CreateReportReasonData = {
        title: values.title,
        description: values.description,
      };

      await createReportReason(createData);
      message.success("Report reason created successfully");
      setIsCreateModalVisible(false);
      form.resetFields();
      fetchReasons();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to create report reason";
      message.error(errorMessage);
    }
  };

  const handleDelete = async (reasonId: string) => {
    try {
      await deleteReportReason(reasonId);
      message.success("Report reason deleted successfully");
      fetchReasons();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to delete report reason";
      message.error(errorMessage);
    }
  };

  const handleRestore = async (reasonId: string) => {
    try {
      await restoreReportReason(reasonId);
      message.success("Report reason restored successfully");
      fetchReasons();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to restore report reason";
      message.error(errorMessage);
    }
  };

  const handleForceDelete = async (reasonId: string) => {
    try {
      await forceDeleteReportReason(reasonId);
      message.success("Report reason permanently deleted successfully");
      fetchReasons();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to permanently delete report reason";
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => text || "-",
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
      fixed: "right" as const,
      width: 90,
      render: (_: unknown, record: AdminReportReason) => (
        <Space size={0}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="Edit"
            size="small"
          />
          {record.deleted_at ? (
            <>
              <Popconfirm
                title="Are you sure you want to restore this report reason?"
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
              <Popconfirm
                title="Are you sure you want to permanently delete this report reason?"
                onConfirm={() => handleForceDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  title="Force Delete"
                  size="small"
                />
              </Popconfirm>
            </>
          ) : (
            <Popconfirm
              title="Are you sure you want to delete this report reason?"
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
        <Title level={2}>Report - Reason Report</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Reason
        </Button>
      </Flex>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space>
            <Input
              placeholder="Search by title"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 300 }}
              value={searchParams.title || ""}
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearch("");
                }
              }}
            />
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
              disabled={!searchParams.title && !searchParams.deleted_at}
            >
              Clear Filters
            </Button>
          </Space>
        </Space>

        <Table
          columns={columns}
          dataSource={reasons}
          loading={loading}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reasons`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingReason ? "Edit Report Reason" : "Create Report Reason"}
        open={isEditModalVisible || isCreateModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingReason ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingReason ? handleEditSubmit : handleCreateSubmit}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter title" maxLength={255} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter description"
              maxLength={1000}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default ReportReasonView;
