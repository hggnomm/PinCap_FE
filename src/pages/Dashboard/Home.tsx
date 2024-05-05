import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Button, Col, Layout, Row, Card } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
  return (
    <Layout className="main-layout">
      <Row className="home-layout">
        <Row gutter={16} style={{ margin: "20px" }}>
          <Col span={8}>
            <Card title="Album/Media" bordered={false}>
              Quantity of Album/Media:
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Media Report" bordered={false}>
              Quantity of unprocessed media reports: 2/10
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Users" bordered={false}>
              Quantity of user:
            </Card>
          </Col>
          <Col span={4}></Col>
          <Col span={8} style={{ marginTop: "20px" }}>
            <Card title="Tags" bordered={false}>
              Quantity of tags:
            </Card>
          </Col>
          <Col span={8} style={{ marginTop: "20px" }}>
            <Card title="Feelings " bordered={false}>
              Quantity of feelings:
            </Card>
          </Col>
        </Row>
      </Row>
    </Layout>
  );
};

export default Dashboard;
