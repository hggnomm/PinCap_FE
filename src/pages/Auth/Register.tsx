import { Button, Col, Form, Input, notification, Row } from "antd";
import { register } from "../../api/auth";
import React from "react";
import Title from "antd/es/typography/Title";
import RegisterImage from "../../assets/img/PinCap/register_page_image.jpg";
import { LogoIcon } from "../../assets/img";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const onSwitchLogin = () => {
    navigate("/login");
  };

  const onFinish = async (values: any) => {
    try {
      const response = await register(values);

      if (response.status === 422) {
        notification.error({
          message: "Registration Failed",
          description:
            response.message || "An error occurred. Please try again later.",
        });
      } else {
        notification.success({
          message: response.message || "Registration successful",
          description:
            "Please check your email for a confirmation link to verify your account.",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Can't register",
        description: error?.message || "An unknown error occurred.",
      });
    }
  };

  return (
    <Row className="main-page">
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
            Create an account
          </Title>
          <span>Step into a world of opportunities with PinCap today!</span>
        </Row>
        {contextHolder}
        <Form name="register_form" className="form" onFinish={onFinish}>
          <Row className="form-field">
            <span>First name</span>
            <Form.Item name="first_name" rules={[{ required: true }]} noStyle>
              <Input />
            </Form.Item>
          </Row>
          <Row className="form-field">
            <span>Last name</span>
            <Form.Item name="last_name" rules={[{ required: true }]} noStyle>
              <Input />
            </Form.Item>
          </Row>
          <Row className="form-field">
            <span>Email</span>
            <Form.Item name="email" rules={[{ required: true }]} noStyle>
              <Input />
            </Form.Item>
          </Row>

          <Row className="form-field">
            <span>Password</span>
            <Form.Item name="password" rules={[{ required: true }]} noStyle>
              <Input.Password />
            </Form.Item>
          </Row>

          <Row className="form-field">
            <span>Confirm Password</span>
            <Form.Item
              name="password_confirmation"
              rules={[{ required: true }]}
              noStyle
            >
              <Input.Password />
            </Form.Item>
          </Row>

          <div className="field-btn">
            <Button
              className="button submit-btn"
              type="primary"
              htmlType="submit"
            >
              Register
            </Button>
          </div>
          <Row className="register-field">
            <div>
              Have An Account Yet?{" "}
              <span onClick={onSwitchLogin}>Login an account</span>
            </div>
          </Row>
        </Form>
      </Col>
      <Col xs={0} md={14} className="left-login">
        <motion.img
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          src={RegisterImage}
          alt="Login Page"
        />
      </Col>
    </Row>
  );
};

export default Register;
