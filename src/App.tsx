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
import Profile from "./pages/PinCap/Profile/Profile";
import EditProfile from "./pages/PinCap/EditProfile/EditProfile";
import UserProfile from "./pages/PinCap/UserProfile/UserProfile";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ChatbotProvider from "./components/chatbot/ChatbotProvider";
import { ROUTES } from "./constants/routes";
import { useAuth } from "./hooks";
import { Navigate } from "react-router-dom";

const HomeRouteHandler = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to={ROUTES.PINCAP_HOME} replace />;
  }
  
  return (
    <>
      <HeaderCommon />
      <Home />
      <ChatbotProvider />
    </>
  );
};

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
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          <Route path={ROUTES.FORBIDDEN} element={<Forbidden />} />

          <Route path={ROUTES.HOME} element={<HomeRouteHandler />} />

          {/* Protected Routes */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Layout className="main-container">
                  <HeaderCommon />
                  <Layout className="body-layout">
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
                        <Route path={ROUTES.PROFILE} element={<Profile />} />
                        <Route path={ROUTES.EDIT_PROFILE} element={<EditProfile />} />
                        <Route path={ROUTES.USER_PROFILE} element={<UserProfile />} />
                        
                        {/* Catch all - redirect to 404 */}
                        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
                      </Routes>
                    </Content>
                  </Layout>
                  <ChatbotProvider />
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
