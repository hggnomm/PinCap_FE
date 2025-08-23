import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { ROUTES } from "./constants/routes";
import { useAuth } from "./hooks";

const App = () => {
  const { isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <LoadingSpinner isLoading={true}>
        <div />
      </LoadingSpinner>
    );
  }

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
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />

          <Route path={ROUTES.HOME} element={
            <>
              <HeaderCommon />
              <Home />
            </>
          } />

          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Layout className="main-container">
                  <HeaderCommon />
                  <SiderCommon />
                  <Content className="right-layout">
                    <Routes>
                      <Route
                        path={ROUTES.PINCAP_HOME}
                        element={<PinCap />}
                      />
                      <Route
                        path={ROUTES.CREATE_MEDIA}
                        element={<CreateMedia />}
                      />
                      <Route path={ROUTES.AI_TOOLS} element={<ImageAi />} />
                      <Route
                        path={ROUTES.MEDIA_DETAIL}
                        element={<DetailMedia />}
                      />
                      <Route path={ROUTES.MY_ALBUM} element={<MyAlbum />} />
                      <Route
                        path={ROUTES.ALBUM_DETAIL}
                        element={<DetailAlbum />}
                      />
                      <Route path={ROUTES.MY_MEDIA} element={<MyMedia />} />
                    </Routes>
                  </Content>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </ConfigProvider>
  );
};

export default App;
