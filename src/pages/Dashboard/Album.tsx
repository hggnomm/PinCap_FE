import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  Button,
  Col,
  Layout,
  Row,
  Card,
  Table,
  Space,
  Tag,
  Pagination,
} from "antd";
import { Link, Route, useLocation, useNavigate } from "react-router-dom";

const baseURL = "http://localhost:8000/api";
const Album = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [countPage, setCountPage] = useState(1);
  const [album, setAlbum] = useState(null);
  const [dataAlbum, setDataAlbum] = useState({
    id: "",
    albumName: "",
    privacy: "",
    description: "",
    username: "",
  });
  useEffect(() => {
    getAllAlbum();
  }, [currentPage]);
  const getAllAlbum = async () => {
    try {
      const response = await axios.get(
        baseURL + "/album/listAlbum?page=" + currentPage
      );
      setAlbum(response.data.listAlbums.data);
      setCountPage(response.data.listAlbums.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const deleteAlbum = async(id) => {
    try {
      const response = await axios.delete(
        baseURL + "/album/" + id
      );
      if(response) {
        // window.location.reload(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  useEffect(() => {
    if (album != null) {
      const data = album.map((value) => {
        return {
          id: value.id,
          albumName: value.albumName,
          privacy: value.privacy,
          description: value.description,
          username: value.user_owner.email,
        };
      });
      setDataAlbum(data);
    }
  }, [album]);
  const columns = [
    {
      title: "Album name",
      dataIndex: "albumName",
      key: "albumName",
    },
    {
      title: "Privacy",
      dataIndex: "privacy",
      key: "privacy",
      render: (text, record) => (
        <span style={{ color: text === "PRIVATE" ? "red" : "blue" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "User Owned Album",
      key: "username",
      dataIndex: "username",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/dashboard/album/${record.id}`}>Album detail</Link>
          <a onClick={() => deleteAlbum(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <Layout className="main-layout">
      <Row className="home-layout">
        <Button
          // onClick={handleAdd}
          type="primary"
          style={{
            margin: "15px 30px",
            width: "20vh",
          }}
        >
          Add Album
        </Button>
        {dataAlbum !== null && dataAlbum.length > 0 && (
          <>
            <Table
              style={{ margin: "15px 30px" }}
              columns={columns}
              dataSource={dataAlbum}
              rowKey={"id"}
              pagination={{
                current: currentPage,
                total: countPage * 10,
                onChange: handlePageChange,
                showSizeChanger: true, // Cho phép chọn số lượng items per page
                pageSizeOptions: ["10", "20", "50", "100"], // Các lựa chọn số trang
                style: { marginTop: "15px", textAlign: "center" },
              }}
            />
          </>
        )}
      </Row>
    </Layout>
  );
};

export default Album;
