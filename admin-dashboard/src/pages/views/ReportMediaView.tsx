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
} from "@ant-design/icons";
import type {
  AdminMediaReport,
  GetMediaReportsParams,
  UpdateMediaReportData,
} from "@/api/mediaReports";
import {
  getMediaReports,
  updateMediaReport,
  deleteMediaReport,
  restoreMediaReport,
  forceDeleteMediaReport,
} from "@/api/mediaReports";
import { getReportReasons } from "@/api/reportReasons";
import type { AdminReportReason } from "@/api/reportReasons";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface EditReportFormData {
  report_state: "0" | "1" | "2";
  reason_report_id?: string | null;
  other_reasons?: string | null;
}

const ReportMediaView: React.FC = () => {
  const [reports, setReports] = useState<AdminMediaReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportReasons, setReportReasons] = useState<AdminReportReason[]>([]);

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
  const [searchParams, setSearchParams] = useState<GetMediaReportsParams>({
    page: 1,
    per_page: 10,
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState<AdminMediaReport | null>(
    null
  );
  const [form] = Form.useForm();

  const fetchReportReasons = async () => {
    try {
      const response = await getReportReasons({
        deleted_at: "null",
        per_page: 1000,
      });
      setReportReasons(response.data);
    } catch (error) {
      console.error("Failed to fetch report reasons:", error);
    }
  };

  const fetchReports = async (calculateTotal = false) => {
    setLoading(true);
    try {
      const response = await getMediaReports(searchParams);
      setReports(response.data);

      if (response.data.length === 0 && pagination.total === 0) {
        setPagination((prev) => ({
          ...prev,
          total: 0,
        }));
      } else if (calculateTotal || pagination.total === 0) {
        try {
          const countResponse = await getMediaReports({
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
          : "Failed to fetch media reports. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportReasons();
  }, []);

  useEffect(() => {
    const hasFilters = Boolean(
      searchParams.report_state ||
        searchParams.user_id ||
        searchParams.media_id ||
        searchParams.deleted_at
    );

    fetchReports(pagination.total === 0 || hasFilters);
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

  const handleFilterState = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      report_state: value as "0" | "1" | "2" | undefined,
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

  const handleSearchMediaId = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      media_id: value || undefined,
      page: 1,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleSearchReporterId = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      user_id: value || undefined,
      page: 1,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleClearFilters = () => {
    const defaultParams: GetMediaReportsParams = {
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

  const handleEdit = (report: AdminMediaReport) => {
    setEditingReport(report);
    form.setFieldsValue({
      report_state: report.report_state || "0",
      reason_report_id: report.reason_report_id || null,
      other_reasons: report.other_reasons || null,
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values: EditReportFormData) => {
    if (!editingReport) return;

    try {
      const updateData: UpdateMediaReportData = {
        report_state: values.report_state,
        reason_report_id: values.reason_report_id || null,
        other_reasons: values.other_reasons || null,
      };

      await updateMediaReport(editingReport.id, updateData);
      message.success("Media report updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      fetchReports();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to update media report";
      message.error(errorMessage);
    }
  };

  const handleDelete = async (reportId: string) => {
    try {
      await deleteMediaReport(reportId);
      message.success("Media report deleted successfully");
      fetchReports();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to delete media report";
      message.error(errorMessage);
    }
  };

  const handleRestore = async (reportId: string) => {
    try {
      await restoreMediaReport(reportId);
      message.success("Media report restored successfully");
      fetchReports();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to restore media report";
      message.error(errorMessage);
    }
  };

  const handleForceDelete = async (reportId: string) => {
    try {
      await forceDeleteMediaReport(reportId);
      message.success("Media report permanently deleted successfully");
      fetchReports();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to permanently delete media report";
      message.error(errorMessage);
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "0":
        return "orange";
      case "1":
        return "blue";
      case "2":
        return "green";
      default:
        return "default";
    }
  };

  const getStateText = (state: string) => {
    switch (state) {
      case "0":
        return "Unprocessed";
      case "1":
        return "Processing";
      case "2":
        return "Processed";
      default:
        return state;
    }
  };

  const columns = [
    {
      title: "ID",
      key: "id",
      width: 200,
      render: (_: unknown, record: AdminMediaReport) => {
        const baseUrl = getBaseUrl();
        const mediaLink = `${baseUrl}/media/${record.media_id}`;
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
      title: "Media",
      key: "media",
      render: (_: unknown, record: AdminMediaReport) => {
        if (record.report_media) {
          const mediaUrl = record.report_media.media_url;
          const isImage =
            mediaUrl &&
            typeof mediaUrl === "string" &&
            mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);

          return (
            <div className="flex items-center gap-4">
              {isImage ? (
                <Image
                  src={mediaUrl}
                  alt={record.report_media.media_name || "Media"}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover" }}
                  preview={false}
                />
              ) : (
                <Tag>Media</Tag>
              )}
              <span className="text-sm">
                {record.report_media.media_name || record.media_id}
              </span>
            </div>
          );
        }
        return record.media_id || "-";
      },
    },
    {
      title: "Reporter",
      key: "reporter",
      render: (_: unknown, record: AdminMediaReport) => {
        if (record.user_report) {
          return `${record.user_report.first_name} ${record.user_report.last_name}`;
        }
        return record.user_id || "-";
      },
    },
    {
      title: "Reason",
      key: "reason",
      render: (_: unknown, record: AdminMediaReport) => {
        if (record.reason_report) {
          return record.reason_report.title;
        }
        return "-";
      },
    },
    {
      title: "Other Reasons",
      dataIndex: "other_reasons",
      key: "other_reasons",
      ellipsis: true,
      render: (text: string | null) => text || "-",
    },
    {
      title: "State",
      dataIndex: "report_state",
      key: "report_state",
      render: (state: string) => (
        <Tag color={getStateColor(state)}>{getStateText(state)}</Tag>
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
      fixed: "right" as const,
      width: 90,
      render: (_: unknown, record: AdminMediaReport) => (
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
                title="Are you sure you want to restore this report?"
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
                title="Are you sure you want to permanently delete this report?"
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
              title="Are you sure you want to delete this report?"
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
        <Title level={2}>Report - Media</Title>
      </Flex>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space>
            <Input
              placeholder="Search by Media ID"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 200 }}
              value={searchParams.media_id || ""}
              onPressEnter={(e) => handleSearchMediaId(e.currentTarget.value)}
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearchMediaId("");
                }
              }}
            />
            <Input
              placeholder="Search by Reporter ID"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 200 }}
              value={searchParams.user_id || ""}
              onPressEnter={(e) =>
                handleSearchReporterId(e.currentTarget.value)
              }
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearchReporterId("");
                }
              }}
            />
            <Select
              placeholder="Filter by state"
              allowClear
              style={{ width: 150 }}
              value={searchParams.report_state}
              onChange={handleFilterState}
            >
              <Option value="0">Unprocessed</Option>
              <Option value="1">Processing</Option>
              <Option value="2">Processed</Option>
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
                !searchParams.report_state &&
                !searchParams.user_id &&
                !searchParams.media_id &&
                !searchParams.deleted_at
              }
            >
              Clear Filters
            </Button>
          </Space>
        </Space>

        <Table
          columns={columns}
          dataSource={reports}
          loading={loading}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reports`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title="Edit Media Report"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Update"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          initialValues={{
            report_state: "0",
          }}
        >
          <Form.Item
            name="report_state"
            label="Report State"
            rules={[{ required: true, message: "Please select a state" }]}
          >
            <Select>
              <Option value="0">Unprocessed</Option>
              <Option value="1">Processing</Option>
              <Option value="2">Processed</Option>
            </Select>
          </Form.Item>

          <Form.Item name="reason_report_id" label="Reason">
            <Select allowClear placeholder="Select a reason">
              {reportReasons.map((reason) => (
                <Option key={reason.id} value={reason.id}>
                  {reason.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="other_reasons" label="Other Reasons">
            <TextArea
              rows={4}
              placeholder="Enter other reasons (optional)"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default ReportMediaView;
