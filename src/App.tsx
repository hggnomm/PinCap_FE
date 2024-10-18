import { Login, Home, Register } from "./pages";
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

const App = () => {
  const tokenPayload = useSelector((state: any) => state.auth);
  const [isLogin, setIsLogin] = useState(false);
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
      if (pathname == "/sign-in" || pathname == "/sign-up") return;
      navigate("/home");
      setIsLogin(false);
    }
  }, [tokenPayload.email]);

  return (
    <ConfigProvider>
      <div className="App">
        <Routes>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />

          <Route
            path="*"
            element={
              <Layout className="main-container">
                {pathname === "/sign-in" ? "" : <HeaderCommon />}
                {!isLogin ? (
                  <>
                    <SiderCommon />
                    <Content>
                      <Routes>
                        <Route path="/" element={<PinCap />} />
                        <Route path="/create-media" element={<CreateMedia />} />
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
                      <Route path="/home" element={<Home />} />
                    </Routes>
                  </Content>
                )}
              </Layout>
            }
          />
        </Routes>
      </div>
    </ConfigProvider>
  );
};

export default App;
