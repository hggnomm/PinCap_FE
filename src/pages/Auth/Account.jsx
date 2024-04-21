import { Col, Row, Tabs } from "antd";
import Login from "./Login";
import Register from "./Register";
import { useEffect } from "react";

const Account = () => {
  useEffect(() => {
    document.title = "Account";
  }, []);
  const items = [
    {
      label: "Login",
      key: "1",
      children: <Login />,
    },
    {
      label: "Register",
      key: "2",
      children: <Register />,
    },
  ];
  return (
    <Row className="main-account-content" justify="space-around" align="middle">
      <Col
        xs={24}
        sm={24}
        md={16}
        lg={16}
        xl={8}
        xxl={6}
        className="form-layout"
      >
        <Tabs
          xs={24}
          sm={24}
          md={24}
          lg={16}
          xl={10}
          xxl={8}
          defaultActiveKey="1"
          items={items}
          className="form-account"
        />
      </Col>
    </Row>
  );
};
export default Account;
