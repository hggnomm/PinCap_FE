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
import type { AdminUser, GetUsersParams, UpdateUserData } from "@/api/users";
import {
  getUsers,
  updateUser,
  deleteUser,
  restoreUser,
  createUser,
} from "@/api/users";

const { Title } = Typography;
const { Option } = Select;

interface EditUserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role?: "0" | "1" | null;
  password?: string;
}

const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<GetUsersParams>({
    page: 1,
    per_page: 10,
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = async (calculateTotal = false) => {
    setLoading(true);
    try {
      const response = await getUsers(searchParams);
      setUsers(response.data);

      // Use total from API response if available
      if (response.total !== undefined) {
        setPagination((prev) => ({
          ...prev,
          total: response.total || 0,
        }));
      } else if (calculateTotal || pagination.total === 0) {
        // Calculate total by fetching with large per_page to count all
        // Only do this when needed (first load or when filters change)
        try {
          const countResponse = await getUsers({
            ...searchParams,
            page: 1,
            per_page: 1000, // Fetch large number to count total
          });
          const totalCount = countResponse.data.length;

          // If we got less than 1000, that's the total
          // If we got exactly 1000, there might be more, but for now use this
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
            // Last page
            total = (currentPage - 1) * perPage + dataLength;
          } else {
            // Not last page, estimate
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
          // No data on this page
          setPagination((prev) => ({
            ...prev,
            total: (currentPage - 1) * perPage,
          }));
        } else if (dataLength < perPage) {
          // Last page
          setPagination((prev) => ({
            ...prev,
            total: (currentPage - 1) * perPage + dataLength,
          }));
        }
        // If dataLength === perPage, keep current total (might be more pages)
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to fetch users. Please try again.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Calculate total on first load or when filters change
    const hasFilters = Boolean(
      searchParams.email ||
        searchParams.role ||
        searchParams.deleted_at ||
        searchParams.first_name ||
        searchParams.last_name
    );

    // Calculate total when filters change or on first load
    fetchUsers(pagination.total === 0 || hasFilters);
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
      email: value || undefined,
      page: 1,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleFilterRole = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      role: value as "0" | "1" | undefined,
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
    const defaultParams: GetUsersParams = {
      page: 1,
      per_page: 10,
    };
    setSearchParams(defaultParams);
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0, // Reset to 0 to trigger total calculation
    });
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone || "",
      role: user.role === "ADMIN" ? "1" : "0",
    });
    setIsEditModalVisible(true);
  };

  const handleCreate = () => {
    form.resetFields();
    setEditingUser(null);
    setIsCreateModalVisible(true);
  };

  const handleEditSubmit = async (values: EditUserFormData) => {
    if (!editingUser) return;

    try {
      const updateData: UpdateUserData = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone || null,
        role: values.role || null,
      };

      if (values.password) {
        updateData.password = values.password;
      }

      await updateUser(editingUser.id, updateData);
      message.success("User updated successfully");
      setIsEditModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to update user";
      message.error(errorMessage);
    }
  };

  const handleCreateSubmit = async (
    values: EditUserFormData & { password: string }
  ) => {
    try {
      await createUser({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        phone: values.phone || null,
        role: values.role || null,
      });
      message.success("User created successfully");
      setIsCreateModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to create user";
      message.error(errorMessage);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to delete user";
      message.error(errorMessage);
    }
  };

  const handleRestore = async (userId: string) => {
    try {
      await restoreUser(userId);
      message.success("User restored successfully");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Failed to restore user";
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
      title: "Name",
      key: "name",
      render: (_: unknown, record: AdminUser) =>
        `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string | null) => phone || "-",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "red" : "blue"}>
          {role === "ADMIN" ? "Admin" : "User"}
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
      render: (_: unknown, record: AdminUser) => (
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
              title="Are you sure you want to restore this user?"
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
              title="Are you sure you want to delete this user?"
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
        <Title level={2}>User Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create User
        </Button>
      </Flex>

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space>
            <Input
              placeholder="Search by email"
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: 300 }}
              value={searchParams.email || ""}
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearch("");
                }
              }}
            />
            <Select
              placeholder="Filter by role"
              allowClear
              style={{ width: 150 }}
              value={searchParams.role}
              onChange={handleFilterRole}
            >
              <Option value="1">Admin</Option>
              <Option value="0">User</Option>
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
                !searchParams.email &&
                !searchParams.role &&
                !searchParams.deleted_at &&
                !searchParams.first_name &&
                !searchParams.last_name
              }
            >
              Clear Filters
            </Button>
          </Space>
        </Space>

        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          scroll={{ x: "max-content" }}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit User"
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
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select>
              <Option value="0">User</Option>
              <Option value="1">Admin</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="password"
            label="New Password (leave empty to keep current)"
            rules={[
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Modal */}
      <Modal
        title="Create User"
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
            name="first_name"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select>
              <Option value="0">User</Option>
              <Option value="1">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default UserManagementView;
