import { GoogleOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  notification,
} from "antd";
import { login } from "../../api/auth";
import { useDispatch } from "react-redux";
import { addToken } from "../../store/authSlice";
import React from "react";
import GoogleIcon from "../../assets/img/PinCap/googleIcon.png";
import "./index.less";

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const onLogin = async (values: any) => {
    try {
      const data = await login(values);

      if (data) {
        dispatch(addToken(data.token));
        localStorage.setItem("token", data.token);
        window.location.reload();
      } else {
        console.log("Dang Nhap that bai");
      }
    } catch (e) {
      api.open({
        message: "Login Failed",
        onClose: close,
      });
    }
  };

  return (
    <Col>
      <Form
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onLogin}
        autoComplete="off"
        className="form-login"
      >
        {contextHolder}
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input
            prefix={
              <MailOutlined type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
            }
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password
            prefix={
              <LockOutlined type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
            }
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="btn-login">
            SIGN IN
          </Button>
        </Form.Item>
      </Form>

      {/* another choice */}
      <Row>
        <Divider>Sign in with</Divider>
        <Button className="btn-login-icon" htmlType="submit" >
          <img src={GoogleIcon} alt="" />
          <span >Continue with Google</span>
        </Button>
      </Row>
    </Col>
  );
};
export default Login;
