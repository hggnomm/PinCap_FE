import { Suspense, lazy } from "react";

import { Route, Routes, Navigate } from "react-router-dom";
import "./App.less";
import { ToastContainer } from "react-toastify";

import Layout, { Content } from "antd/es/layout/layout";

import { ConfigProvider } from "antd";

import ChatbotProvider from "./components/Chatbot/ChatbotProvider";
import HeaderCommon from "./components/Header/HeaderCommon";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import SiderCommon from "./components/Sider/SiderCommon";
import { ROUTES } from "./constants/routes";
import { MediaToastProvider } from "./contexts/MediaToastContext";
import { ImageAi } from "./pages/AITools";
import { Login, Register } from "./pages/Auth";
import { Home, NotFound, Forbidden } from "./pages/Common";
import {
  PinCap,
  CreateMedia,
  DetailMedia,
  DetailAlbum,
  EditProfile,
  MyAlbum,
  MyMedia,
  Profile,
  Search,
  UserProfile,
} from "./pages/PinCap";
import { useAuth } from "./react-query";

const MediaToastContainer = lazy(
  () => import("./components/MediaSuccessToast/MediaToastContainer")
);

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
      <MediaToastProvider>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          closeOnClick={true}
          pauseOnHover={true}
        />
        <Suspense fallback={null}>
          <MediaToastContainer />
        </Suspense>
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
                          <Route
                            path={ROUTES.EDIT_PROFILE}
                            element={<EditProfile />}
                          />
                          <Route
                            path={ROUTES.USER_PROFILE}
                            element={<UserProfile />}
                          />
                          <Route path={ROUTES.SEARCH} element={<Search />} />

                          {/* Catch all - redirect to 404 */}
                          <Route
                            path="*"
                            element={<Navigate to={ROUTES.NOT_FOUND} replace />}
                          />
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
      </MediaToastProvider>
    </ConfigProvider>
  );
};

export default App;
