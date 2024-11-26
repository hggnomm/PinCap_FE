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
import Dashboard from "./pages/Dashboard/Home";
import Album from "./pages/Dashboard/Album";
import AlbumDetail from "./pages/Dashboard/AlbumDetail";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner"; // Import LoadingSpinner component
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home/Home";

const App = () => {
  const tokenPayload = useSelector((state: any) => state.auth);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to control loading spinner
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (tokenPayload.email) {
      if (tokenPayload.exp < Date.now() / 1000) {
        localStorage.removeItem("token");
        navigate("/sign-in");
      } else {
        setIsLogin(true);
      }
    } else {
      if (pathname === "/sign-in" || pathname === "/sign-up") return;
      setIsLogin(false);
    }
    setIsLoading(false); // Hide loading spinner after login check
  }, [tokenPayload.email, pathname, navigate]);

  return (
    <ConfigProvider>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        closeOnClick={true}
        pauseOnHover={true}
      />
      <div className="App">
        {/* Display the loading spinner when isLoading is true */}
        <Routes>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />

          <Route
            path="*"
            element={
              <LoadingSpinner isLoading={isLoading}>
                <Layout className="main-container">
                  {pathname === "/sign-in" ? "" : <HeaderCommon />}
                  {isLogin ? (
                    <>
                      <SiderCommon />
                      <Content>
                        <Routes>
                          <Route path="/home" element={<PinCap />} />
                          <Route
                            path="/create-media"
                            element={<CreateMedia />}
                          />
                          <Route path="/ai" element={<ImageAi />} />
                          <Route path="/media/:id" element={<DetailMedia />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/dashboard/album" element={<Album />} />
                          <Route
                            path="/dashboard/album/:id"
                            element={<AlbumDetail />}
                          />
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
