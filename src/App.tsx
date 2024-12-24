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
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner"; // Import LoadingSpinner component
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home/Home";
import MyAlbum from "./pages/PinCap/MyAlbum/MyAlbum";
import MyMedia from "./pages/PinCap/MyMedia/MyMedia";
import DetailAlbum from "./pages/PinCap/DetailAlbum/DetailAlbum";

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
      navigate("/");
    }
    setIsLoading(false); 
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
                          <Route path="/album" element={<MyAlbum />} />
                          <Route path="/album/:id" element={<DetailAlbum />} />
                          {/* Dynamic route for MyMedia with email */}
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
