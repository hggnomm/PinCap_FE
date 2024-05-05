import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Button, Col, Menu, Row } from 'antd';
import Sider from 'antd/es/layout/Sider'
import React, { useState } from 'react'
import Layout from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      trigger={null}
      collapsed={collapsed}
      width={300}
      className='menu'
    >
      <Row className='top-menu'>
        <Col>
          <Button
            type="text"
            icon={collapsed
              ? <MenuUnfoldOutlined style={{ fontSize: "25px", color: "#fff" }} />
              : <MenuFoldOutlined style={{ fontSize: "25px", color: "#fff" }} />}
            onClick={() => setCollapsed(!collapsed)}
          />
        </Col>
        {/* <Col className='logo-crowdow'>
            {!collapsed ? <img src={Crowdow} width={"160%"}></img> : null}
          </Col> */}
      </Row>
      <Menu
        className='main-menu'
        mode='inline'
        defaultSelectedKeys={['1']}
       
      >
        <Menu.Item key='1' icon={<VideoCameraOutlined />}>
          <Link to='/dashboard'>Home</Link>
        </Menu.Item>
        <Menu.Item key='2' icon={<VideoCameraOutlined />}>
          <Link to='/dashboard/album'>Album</Link>
        </Menu.Item>
        <Menu.Item key='3' icon={<VideoCameraOutlined />}>
          <Link to='/dashboard/mediaReport'>Media Report</Link>
        </Menu.Item>
        <Menu.Item key='4' icon={<VideoCameraOutlined />}>
          <Link to='/dashboard/users'>Users</Link>
        </Menu.Item>
        <Menu.Item key='5' icon={<VideoCameraOutlined />}>
          <Link to='/dashboard/tags'>Tags</Link>
        </Menu.Item>
        <Menu.Item key='6' icon={<VideoCameraOutlined />}>
          <Link to='/dashboard/feelings'>Feelings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default Sidebar