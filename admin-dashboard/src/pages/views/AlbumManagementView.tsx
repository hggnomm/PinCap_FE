import { useState, useEffect } from "react";
import {
  Card,
  Space,
  Table,
  Typography,
  Button,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Flex,
} from "antd";
import {
  DeleteOutlined,
  UndoOutlined,
  SearchOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import type { AdminAlbum, GetAlbumsParams } from "@/api/albums";
import { getAlbums, restoreAlbum, forceDeleteAlbum } from "@/api/albums";

const { Title } = Typography;
const { Option } = Select;

const AlbumManagementView: React.FC = () => {
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [loading, setLoading] = useState(false);

  // Get base URL based on environment
  const getBaseUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3000";
    }
    return "https://pin-cap-fe.vercel.app";
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<GetAlbumsParams>({
    page: 1,
    per_page: 10,
  });

  const fetchAlbums = async (calculateTotal = false) => {
    setLoading(true);
    try {
      const response = await getAlbums(searchParams);
      setAlbums(response.data);

      // Use total from API response if available
      if (response.total !== undefined) {
        setPagination((prev) => ({
          ...prev,
          total: response.total || 0,
        }));
      } else if (calculateTotal || pagination.total === 0) {
        // Calculate total by fetching with large per_page to count all
        try {
          const countResponse = await getAlbums({
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
          : "Failed to fetch albums. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasFilters = Boolean(
      searchParams.album_name ||
        searchParams.description ||
        searchParams.user_search ||
        searchParams.privacy ||
        searchParams.user_id ||
        searchParams.deleted_at
    );

    fetchAlbums(pagination.total === 0 || hasFilters);
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
      album_name: value || undefined,
      page: 1,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleFilterPrivacy = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      privacy: value as "0" | "1" | undefined,
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
    const defaultParams: GetAlbumsParams = {
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

  const handleRestore = async (albumId: string) => {
    try {
      await restoreAlbum(albumId);
      message.success("Album restored successfully");
      fetchAlbums();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to restore album";
      message.error(errorMessage);
    }
  };

  const handleForceDelete = async (albumId: string) => {
    try {
      await forceDeleteAlbum(albumId);
      message.success("Album permanently deleted successfully");
      fetchAlbums();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to delete album";
      message.error(errorMessage);
    }
  };

  const columns = [
    {
      title: "ID",
      key: "id",
      width: 300,
      render: (_: unknown, record: AdminAlbum) => {
        const baseUrl = getBaseUrl();
        const albumLink = `${baseUrl}/album/${record.id}`;
        return (
          <a
            href={albumLink}
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
      title: "Name",
      dataIndex: "album_name",
      key: "album_name",
      ellipsis: true,
      render: (name: string | null) => name || "-",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (description: string | null) => description || "-",
    },
    {
      title: "Privacy",
      key: "privacy",
      render: (_: unknown, record: AdminAlbum) => {
        const privacy = record.privacy;
        return privacy ? (
          <Tag color={privacy === "PUBLIC" ? "green" : "orange"}>{privacy}</Tag>
        ) : (
          "-"
        );
      },
    },
    {
      title: "User",
      key: "user",
      render: (_: unknown, record: AdminAlbum) => {
        if (record.user_owner) {
          return `${record.user_owner.first_name} ${record.user_owner.last_name}`;
        }
        return "-";
      },
    },
    {
      title: "Media Count",
      key: "medias_count",
      render: (_: unknown, record: AdminAlbum) => record.medias_count || 0,
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
      render: (_: unknown, record: AdminAlbum) => (
        <Space>
          {record.deleted_at ? (
            <Popconfirm
              title="Are you sure you want to restore this album?"
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
              title="Are you sure you want to permanently delete this album? This action cannot be undone."
              onConfirm={() => handleForceDelete(record.id)}
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
        <Title level={2}>Album Management</Title>
      </Flex>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space>
            <Input
              placeholder="Search by name"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 300 }}
              value={searchParams.album_name || ""}
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearch("");
                }
              }}
            />
            <Select
              placeholder="Filter by privacy"
              allowClear
              style={{ width: 150 }}
              value={searchParams.privacy}
              onChange={handleFilterPrivacy}
            >
              <Option value="0">Private</Option>
              <Option value="1">Public</Option>
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
                !searchParams.album_name &&
                !searchParams.description &&
                !searchParams.user_search &&
                !searchParams.privacy &&
                !searchParams.user_id &&
                !searchParams.deleted_at
              }
            >
              Clear Filters
            </Button>
          </Space>
        </Space>

        <Table
          columns={columns}
          dataSource={albums}
          loading={loading}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} albums`,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </Space>
  );
};

export default AlbumManagementView;
