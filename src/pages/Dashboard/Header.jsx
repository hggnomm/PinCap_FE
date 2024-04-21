import { Button, Col, Row } from 'antd'
import jwtDecode from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { Link } from 'react-scroll';

const Header = () => {
  const [name, setName] = useState("");
  const tokenInfo = useContext(AuthContext);
  const navigate = useNavigate();  
  const [collapseMenu, setCollapseMenu] = useState(false);
  useEffect(() => {
      if(tokenInfo) {
        setName(tokenInfo.name)
      }
  }, [])

  const logoutHandle = () => {
    localStorage.removeItem('token');
    navigate('/sign-in')
  }
  return (
    <Row className='header' >
      <Button 
        type="text" 
        className='btn-menu-mobile'
        onClick={() => setCollapseMenu(!collapseMenu)}
      >
        <MenuUnfoldOutlined style={{ fontSize: "25px", color: "#000"}}/>
      </Button>
      <Col className='title'>
          PINCAP
      </Col>
      <Col>
        <span style={{ margin : '0 30px'}}>{name}</span>
          <Button onClick={() => logoutHandle()} style={{marginRight:'5px'}}>
            Login
          </Button>
          <Button onClick={() => logoutHandle()} style={{marginLeft:'5px'}}>
            Logout
          </Button>
      </Col>
    </Row>
  )
}

export default Header