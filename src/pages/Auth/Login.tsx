import { Checkbox, Col, Row, notification } from "antd";
import { Form, Input, Button } from "antd";
import LoginImage from "../../assets/img/PinCap/login_page_image.jpg";
import { LogoIcon } from "../../assets/img";
import GoogleIcon from "../../assets/img/PinCap/googleIcon.png";
import Title from "antd/es/typography/Title";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../api/auth";
import { addToken } from "../../store/authSlice";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./index.less";

const Login = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      form.setFieldsValue({
        email: savedEmail,
        password: savedPassword,
        remember: true,
      });
      setRememberMe(true);
    }
  }, [form]);

  const onSwitchCreate = () => {
    navigate("/sign-up");
  };

  const onLogin = async (values: any) => {
    try {
      const { email, password, remember } = values;

      const data = await login(values); 

      if (data.token) {
        dispatch(addToken(data.token)); 
        localStorage.setItem("token", data.token);

        if (remember) {
          localStorage.setItem("rememberedEmail", email); 
          localStorage.setItem("rememberedPassword", password); 
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }

        navigate("/home"); 
        window.location.reload(); 
      } else {
        notification.error({
          message: "Login Failed",
          description:
            data?.message || "An error occurred. Please try again later.",
        });
      }
    } catch (error: any) {
      api.open({
        message: "Login Failed",
        description: error.message, 
        onClose: close,
      });
    }
  };

  return (
    <Row className="main-page">
      <Col xs={0} md={14} className="left-login">
        <motion.img
          src={LoginImage}
          alt="Login Page"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </Col>

      <Col xs={24} md={10} className="right-login">
        <Row className="form-header">
          <motion.img
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            src={LogoIcon}
            style={{ width: "10%", cursor: "pointer" }}
            onClick={() => navigate("/home")}
          />
        </Row>
        <Row className="text-header">
          <Title level={2} style={{ margin: 0, color: "#525252" }}>
            Login to your Account
          </Title>
          <span>See what is going on with PinCap</span>
        </Row>
        {contextHolder}

        <Form
          form={form}
          name="login_form"
          initialValues={{ remember: rememberMe }}
          onFinish={onLogin}
          className="form"
        >
          <Row className="form-field">
            <span>Email</span>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input />
            </Form.Item>
          </Row>

          <Row className="form-field">
            <span>Password</span>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Row>

          <Form.Item className="action">
            <Col span={12} className="checkbox-container">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember Me</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12} className="forgot-password">
              <span>Forgot Password?</span>
            </Col>
          </Form.Item>

          <div className="field-btn">
            <Button
              className="button submit-btn"
              type="primary"
              htmlType="submit"
            >
              Login
            </Button>

            <Button className="button btn-login-icon">
              <img src={GoogleIcon} alt="" />
              <span>Continue with Google</span>
            </Button>
          </div>
          <Row className="register-field">
            <div>
              Not Registered Yet?{" "}
              <span onClick={onSwitchCreate}>Create an account</span>
            </div>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
