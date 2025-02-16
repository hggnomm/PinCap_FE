import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.less";
import CreateMedia from "./pages/PinCap/CreateMedia/CreateMedia";
import Layout, { Content } from "antd/es/layout/layout";
import PinCap from "./pages/PinCap/PinCap";
import SiderCommon from "./components/sider/SiderCommon";
import HeaderCommon from "./components/header/HeaderCommon";
import ImageAi from "./pages/AITools/Images/ImageAi";
import DetailMedia from "./pages/PinCap/DetailMedia/DetailMedia";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner"; 
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home/Home";
import MyAlbum from "./pages/PinCap/MyAlbum/MyAlbum";
import MyMedia from "./pages/PinCap/MyMedia/MyMedia";
import DetailAlbum from "./pages/PinCap/DetailAlbum/DetailAlbum";
import { decodedToken } from "./utils/utils";

const App = () => {
  const token = localStorage.getItem("token");
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to control loading spinner
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (token) {
      try {
        const decoded = decodedToken(token);
        const exp = decoded.exp;

        if (exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setIsLogin(true);
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      if (pathname !== "/login" && pathname !== "/register") {
        setIsLogin(false);
        navigate("/");
      }
    }
    setIsLoading(false);
  }, [pathname, navigate, token]);

  return (
    <ConfigProvider>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        closeOnClick={true}
        pauseOnHover={true}
      />
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="*"
            element={
              <LoadingSpinner isLoading={isLoading}>
                <Layout className="main-container">
                  {pathname !== "/login" && <HeaderCommon />}
                  {isLogin ? (
                    <>
                      <SiderCommon />
                      <Content className="right-layout">
                        <Routes>
                          <Route path="/home" element={<PinCap />} />
                          <Route
                            path="/create-media"
                            element={<CreateMedia />}
                          />
                          <Route path="/ai" element={<ImageAi />} />
                          <Route path="/media/:id" element={<DetailMedia />} />
                          <Route path="/album" element={<MyAlbum />} />
                          <Route path="/album/:id" element={<DetailAlbum />} />
                          <Route path="/my-media" element={<MyMedia />} />
                        </Routes>
                      </Content>
                    </>
                  ) : (
                    <Content>
                      <Routes>
                        <Route path="/" element={<Home />} />
                      </Routes>
                    </Content>
                  )}
                </Layout>
              </LoadingSpinner>
            }
          />
        </Routes>
      </div>
    </ConfigProvider>
  );
};

export default App;
