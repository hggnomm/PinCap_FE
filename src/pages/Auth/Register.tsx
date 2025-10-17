import { Button, Col, Form, Input, notification, Row, Progress } from "antd";
import { register, resendVerifyEmail } from "@/api/auth";
import React, { useState, useEffect } from "react";
import Title from "antd/es/typography/Title";
import RegisterImage from "@/assets/img/PinCap/register_page_image.jpg";
import { LogoIcon } from "@/assets/img";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MailOutlined, CheckCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks";
import "./index.less";
// List of common passwords to disallow
const commonPasswords = ["123456", "password", "admin", "qwerty", "welcome", "123456789", "12345678", "111111", "abc123"];

const Register = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    color: "#ff4d4f"
  });
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(ROUTES.PINCAP_HOME, { replace: true });
    }
  }, [user, navigate]);

  const onSwitchLogin = () => {
    navigate(ROUTES.LOGIN);
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
        // Show email verification UI instead of just notification
        setUserEmail(values.email);
        setShowEmailVerification(true);
        
        notification.success({
          message: response.message || "Registration successful",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Can't register",
        description: error?.message || "An unknown error occurred.",
      });
    }
  };

  const handleResendEmail = async () => {
    if (!userEmail) {
      notification.error({
        message: "Error",
        description: "No email address found. Please try registering again.",
      });
      return;
    }

    setIsResending(true);
    try {
      const response = await resendVerifyEmail(userEmail);
      
      notification.success({
        message: "Email Sent",
        description: response.message || "We've sent a new verification email to your inbox.",
      });
    } catch (error: any) {
      console.error("Error resending verification email:", error);
      
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to resend verification email";
      
      notification.error({
        message: "Failed to resend",
        description: errorMessage,
      });
    } finally {
      setIsResending(false);
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
            onClick={() => navigate(ROUTES.HOME)}
          />
        </Row>
        <Row className="text-header">
          <Title level={2} style={{ margin: 0, color: "#525252" }}>
            Create an account
          </Title>
          <span>Step into a world of opportunities with PinCap today!</span>
        </Row>
        {contextHolder}
        
        {showEmailVerification && (
          <div className="flex justify-center items-center w-full py-5">
            <motion.div 
              className="text-center bg-white rounded-xl p-10 shadow-lg border border-gray-100 w-[90%] max-w-md"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="mb-5">
                <CheckCircleOutlined className="text-6xl text-green-500" />
              </div>
              
              <Title level={3} className="text-green-500 text-center my-5">
                Registration Successful!
              </Title>
              
              <div className="flex items-center justify-center my-5 text-base text-gray-600">
                <MailOutlined className="text-xl text-blue-500 mr-2" />
                <span>We've sent a verification email to:</span>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-md py-3 px-5 my-4 text-green-700 font-semibold text-base break-all">
                {userEmail}
              </div>
              
              <div className="my-6">
                <p className="my-2 text-sm text-gray-600 leading-relaxed">
                  Please check your inbox and click the verification link to activate your account.
                </p>
                <p className="my-2 text-sm text-gray-600 leading-relaxed">
                  The link will expire in 24 hours.
                </p>
              </div>
              
              <div className="flex justify-center gap-3 my-8 flex-wrap">
                <Button 
                  type="default" 
                  icon={<ReloadOutlined />}
                  loading={isResending}
                  onClick={handleResendEmail}
                  className="rounded-md font-medium h-10 px-5 border-gray-300 text-gray-600 hover:border-[#a25772] hover:text-[#a25772]"
                >
                  Resend Email
                </Button>
                
                <Button 
                  type="primary"
                  onClick={onSwitchLogin}
                  className="rounded-md font-medium h-10 px-5 bg-[#a25772] border-[#a25772] hover:bg-[#8b4a63] hover:border-[#8b4a63]"
                >
                  Go to Login
                </Button>
              </div>
              
              <div className="border-t border-gray-100 pt-5 mt-6">
                <p className="text-xs text-gray-500 text-center">
                  Didn't receive the email? Check your spam folder or contact support.
                </p>
              </div>
            </motion.div>
          </div>
        )}
        
        {!showEmailVerification && (
          <Form name="register_form" className="form !gap-3" onFinish={onFinish}>
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
        )}
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
