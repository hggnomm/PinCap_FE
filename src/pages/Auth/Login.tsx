import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { notification, Checkbox, Col, Row, Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";

import LoginImage from "@/assets/img/PinCap/login_page_image.jpg";
import { LogoIcon } from "@/assets/img";
import GoogleIcon from "@/assets/img/PinCap/googleIcon.png";
import Title from "antd/es/typography/Title";
import { login } from "@/api/auth";
import { addToken } from "@/store/authSlice";
import { motion } from "framer-motion";
import { LoginRequest } from "Auth/LoginRequest";
import "./index.less";
import { ROUTES } from "@/constants/routes"

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [rememberMe, setRememberMe] = useState(false);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const verifiedToken = params.get("verified-token");

  useEffect(() => {
    if (verifiedToken) {
      handleLoginSuccess({
        token: verifiedToken,
        email: "",
        password: "",
        remember: false,
      });
    }

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

    // Check if account is locked
    checkAccountLockStatus();

    // Setup countdown timer if account is locked
    let interval: NodeJS.Timeout | null = null;
    if (isAccountLocked && lockTimeRemaining > 0) {
      interval = setInterval(() => {
        setLockTimeRemaining((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(interval!);
            resetLoginAttempts();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [form, verifiedToken, isAccountLocked, lockTimeRemaining]);

  const checkAccountLockStatus = () => {
    const lockExpiryTime = localStorage.getItem("loginLockExpiry");
    if (lockExpiryTime) {
      const expiryTime = parseInt(lockExpiryTime);
      const currentTime = Date.now();

      if (currentTime < expiryTime) {
        // Account is still locked
        setIsAccountLocked(true);
        setLockTimeRemaining(Math.ceil((expiryTime - currentTime) / 1000));
      } else {
        // Lock has expired
        resetLoginAttempts();
      }
    }
  };

  const resetLoginAttempts = () => {
    localStorage.removeItem("loginAttempts");
    localStorage.removeItem("loginLockExpiry");
    setIsAccountLocked(false);
    setLockTimeRemaining(0);
  };

  const onSwitchCreate = () => {
    navigate(ROUTES.REGISTER);
  };

  const handleLoginSuccess = (data: LoginRequest) => {
    localStorage.setItem("token", data.token || "");
    dispatch(addToken(data.token || ""));
    resetLoginAttempts();
    navigate(ROUTES.HOME);
  };

  const formatRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Hàm xử lý đăng nhập
  const onLogin = async (values: LoginFormValues) => {
    if (isAccountLocked) {
      api.error({
        message: "Account Locked",
        description: `Too many failed login attempts. Please try again in ${formatRemainingTime(
          lockTimeRemaining
        )}.`,
      });
      return;
    }

    try {
      const { email, password, remember } = values;

      const data: LoginRequest = await login(values);

      if (data.token) {
        localStorage.setItem("token", data.token);
        dispatch(addToken(data.token));

        if (remember) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
        }

        resetLoginAttempts();
        navigate(ROUTES.HOME);
      } else {
        // Handle failed login attempt
        const attempts =
          parseInt(localStorage.getItem("loginAttempts") || "0") + 1;
        localStorage.setItem("loginAttempts", attempts.toString());

        // If reached max attempts, lock account
        if (attempts >= 5) {
          const lockExpiry = Date.now() + 60 * 60 * 1000; // 1 hour lock
          localStorage.setItem("loginLockExpiry", lockExpiry.toString());
          setIsAccountLocked(true);
          setLockTimeRemaining(60 * 60); // 3600 seconds = 1 hour

          api.error({
            message: "Account Locked",
            description:
              "Too many failed login attempts. Your account has been locked for 1 hour.",
          });
        }
      }
    } catch (error: any) {
      // Handle login error
      const attempts =
        parseInt(localStorage.getItem("loginAttempts") || "0") + 1;
      localStorage.setItem("loginAttempts", attempts.toString());

      // If reached max attempts, lock account
      if (attempts >= 5) {
        const lockExpiry = Date.now() + 60 * 60 * 1000; // 1 hour lock
        localStorage.setItem("loginLockExpiry", lockExpiry.toString());
        setIsAccountLocked(true);
        setLockTimeRemaining(60 * 60); // 3600 seconds = 1 hour

        api.error({
          message: "Account Locked",
          description:
            "Too many failed login attempts. Your account has been locked for 1 hour.",
        });
      } else {
        api.error({
          message: "Login Failed",
          description: `${error.message} (${5 - attempts} attempts remaining)`,
        });
      }
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
            onClick={() => navigate(ROUTES.HOME)}
          />
        </Row>
        <Row className="text-header">
          <Title level={2} style={{ margin: 0, color: "#525252" }}>
            Login to your Account
          </Title>
          <span>See what is going on with PinCap</span>
        </Row>
        {contextHolder}

        {isAccountLocked ? (
          <div className="lock-message">
            <Title level={4} style={{ color: "#ff4d4f" }}>
              Account Temporarily Locked
            </Title>
            <p>Too many failed login attempts. Please try again in:</p>
            <h2>{formatRemainingTime(lockTimeRemaining)}</h2>
          </div>
        ) : (
          <Form
            form={form}
            name="login_form"
            initialValues={{ remember: rememberMe }}
            onFinish={onLogin}
            className="form gap-3"
          >
            <Row className="form-field">
              <span>Email</span>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
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

              <Button className="button btn-login-icon" disabled>
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
        )}
      </Col>
    </Row>
  );
};

export default Login;
