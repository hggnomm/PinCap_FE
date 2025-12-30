import { useState } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Space,
  Flex,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "@/api/auth";
import type { LoginFormData } from "@/api/auth";

const { Content } = Layout;
const { Title } = Typography;

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const response = await login(values);
      if (response.token) {
        localStorage.setItem("token", response.token);
        message.success("Login successful!");
        onLoginSuccess();
      }
    } catch (error) {
      const errorMessage =
        (
          error as {
            message?: string;
            response?: { data?: { message?: string } };
          }
        )?.message ||
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        "Login failed";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Content>
        <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
          <Card style={{ width: "100%", maxWidth: 400 }}>
            <Space
              vertical
              size="middle"
              align="center"
              style={{ width: "100%", marginBottom: 24 }}
            >
              <Title level={2}>PinCap Admin Dashboard</Title>
            </Space>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
      </Content>
    </Layout>
  );
};

export default Login;
