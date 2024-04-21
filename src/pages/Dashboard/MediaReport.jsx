import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Button, Col, Layout, Row, Card, Table, Space } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const baseURL = "http://localhost:8000/api";
const MediaReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [countPage, setCountPage] = useState(1);
  const [mediaReport,setMediaReport] = useState({});
  const getAllReport = async () => {
    try {
      const response = await axios.get(
        baseURL + "/reportMedia?page=" + currentPage
      );
      console.log(response.data.reportMedias);
      setMediaReport(response.data.reportMedias.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getAllReport();
  }, []);
  const columns = [
    {
      title: "User reported",
      dataIndex: "userReport",
      key: "userReport",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Media reported",
      dataIndex: "mediaReported",
      key: "mediaReported",
    },
    {
      title: "Reason",
      key: "reason",
      dataIndex: "reason",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
          <a>Reported detail</a>
          <a>Processed</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];
  const data = [
    {
      userReport: "John Brown",
      state: 32,
      mediaReported: "New York No. 1 Lake Park",
      reason: ["nice", "developer"],
    },
    {
      userReport: "Jim Green",
      state: 42,
      mediaReported: "London No. 1 Lake Park",
      reason: ["loser"],
    },
    {
      userReport: "Joe Black",
      state: 32,
      mediaReported: "Sydney No. 1 Lake Park",
      reason: ["cool", "teacher"],
    },
  ];
  return (
    <Layout className="main-layout">
      <Sidebar className="sidebar-layout" />
      <Row className="home-layout">
        <Header />

        <Table
          style={{ margin: "15px 30px" }}
          columns={columns}
          dataSource={mediaReport}
        />
      </Row>
    </Layout>
  );
};

export default MediaReport;
