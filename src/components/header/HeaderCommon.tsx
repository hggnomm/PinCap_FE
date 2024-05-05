import { Avatar, Button, Col, Row } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.less";
import { LogoIcon, TextIcon } from "../../assets/img";
import { useSelector } from "react-redux";
import Notification from "../notification";
import axios from "axios";
import Pusher from 'pusher-js';

const HeaderCommon = () => {
  const [name, setName] = useState("");
  const tokenPayload = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const [collapseMenu, setCollapseMenu] = useState(false);
  useEffect(() => {
    if (tokenPayload) {
      setName(tokenPayload.name);
    }
  }, []);

    
  const logoutHandle = async () =>  {  
    try {
      // Gọi API để lấy danh sách sản phẩm
      const response = await axios.post('http://localhost:81/api/notification/test');
      // Xử lý dữ liệu trả về ở đây
      console.log(response.data);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error fetching products:', error);
    }

    // localStorage.removeItem("token");
    // navigate("/home");
    // window.location.reload(true);
  };
  const loginHandle = () => {
    navigate("/sign-in");
  };
  return (
    <Row className="main-header">
      <Col
        className="left-header"
        onClick={() => {
          navigate("/home");
        }}
      >
        <img className="logo-icon" src={LogoIcon} />
        <img className="text-icon" src={TextIcon} />
      </Col>
      <Col
        className="right-header"
      >
        {
          tokenPayload?.id ?
            <Col className="action-header" xs={{ span: 16 }} lg={{ span: 9, offset: 0 }}>
              <Col className="menu-notification">
                <Notification />
              </Col>
              <Col className="logo-avatar">
                <Avatar />
              </Col>
              <Col>
                {tokenPayload.name}
                <Button
                  onClick={() => logoutHandle()}>
                  Logout
                </Button>
              </Col>

            </Col>

            :
            <>
              <Button
                onClick={() => loginHandle()}
                className="button-auth-sign-in"
              >
                Sign in
              </Button>

              <Button
                onClick={() => loginHandle()}
                className="button-auth-sign-up"
              >
                Sign up
              </Button>
            </>

        }
      </Col>
    </Row>
  );
};

export default HeaderCommon;
