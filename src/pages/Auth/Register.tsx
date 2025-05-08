import { Button, Col, Form, Input, notification, Row, Progress } from "antd";
import { register } from "../../api/auth";
import React, { useState } from "react";
import Title from "antd/es/typography/Title";
import RegisterImage from "../../assets/img/PinCap/register_page_image.jpg";
import { LogoIcon } from "../../assets/img";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// List of common passwords to disallow
const commonPasswords = ["123456", "password", "admin", "qwerty", "welcome", "123456789", "12345678", "111111", "abc123"];

const Register = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    color: "#ff4d4f"
  });

  const onSwitchLogin = () => {
    navigate("/login");
  };

  // Calculate password strength score and feedback
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      return { score: 0, feedback: "", color: "#ff4d4f" };
    }

    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) {
      score += 20;
    } else {
      feedback.push("Password should be at least 8 characters");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Add an uppercase letter");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Add a lowercase letter");
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Add a number");
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 20;
    } else {
      feedback.push("Add a special character");
    }

    // Common password check
    if (commonPasswords.includes(password.toLowerCase())) {
      score = 10;
      feedback = ["This is a commonly used password and not secure"];
    }

    // Determine color based on score
    let color = "#ff4d4f"; // Default red
    if (score >= 80) {
      color = "#52c41a"; // Green
    } else if (score >= 60) {
      color = "#faad14"; // Yellow
    } else if (score >= 40) {
      color = "#fa8c16"; // Orange
    }

    return {
      score,
      feedback: feedback.join(", "),
      color
    };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordValue(password);
    setPasswordStrength(calculatePasswordStrength(password));
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
            <Form.Item 
              name="first_name" 
              rules={[{ required: true, message: "Please enter your first name" }]} 
              noStyle
            >
              <Input />
            </Form.Item>
          </Row>
          <Row className="form-field">
            <span>Last name</span>
            <Form.Item 
              name="last_name" 
              rules={[{ required: true, message: "Please enter your last name" }]} 
              noStyle
            >
              <Input />
            </Form.Item>
          </Row>
          <Row className="form-field">
            <span>Email</span>
            <Form.Item 
              name="email" 
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" }
              ]} 
              noStyle
            >
              <Input />
            </Form.Item>
          </Row>

          <Row className="form-field">
            <span>Password</span>
            <Form.Item 
              name="password" 
              rules={[
                { required: true, message: "Please enter a password" },
                { min: 8, message: "Password must be at least 8 characters" },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                  message: "Password must include uppercase, lowercase, number, and special character"
                },
                {
                  validator: (_, value) => {
                    if (value && commonPasswords.includes(value.toLowerCase())) {
                      return Promise.reject("Please use a stronger password");
                    }
                    return Promise.resolve();
                  },
                },
              ]} 
              noStyle
            >
              <Input.Password onChange={handlePasswordChange} />
            </Form.Item>
            
            {passwordValue && (
              <div className="password-strength">
                <Progress 
                  percent={passwordStrength.score} 
                  showInfo={false} 
                  strokeColor={passwordStrength.color}
                  size="small"
                  style={{ marginTop: 5 }}
                />
                <div className="strength-label" style={{ color: passwordStrength.color, fontSize: '12px', marginTop: 5 }}>
                  {passwordStrength.score === 100 ? "Strong password" : passwordStrength.feedback}
                </div>
              </div>
            )}
          </Row>

          <Row className="form-field">
            <span>Confirm Password</span>
            <Form.Item
              name="password_confirmation"
              dependencies={['password']}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("The two passwords do not match");
                  },
                }),
              ]}
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
