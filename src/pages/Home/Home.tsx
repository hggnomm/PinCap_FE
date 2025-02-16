import React, { useEffect } from "react";
import "./index.less";
import { Button, Layout, Row } from "antd";
import { motion } from "framer-motion";
import VideoLandingPage from "../../assets/videos/VideoPinCapAI.mp4";
import Preloader from "../../components/preloader/Preloader";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const waveEffect = {
  hidden: { y: 0 },
  visible: {
    y: [0, -20, 0],
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 2,
      ease: "easeInOut",
    },
  },
};

const Home = () => {
  const tokenPayload = useSelector((state: any) => state.auth);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenPayload.email) {
      navigate("/home");
    }
  }, [tokenPayload.email, pathname]);
  return (
    <>
      <Preloader />
      <Layout className="main-layout">
        <Row className="home-layout">
          {/* Section 1 */}
          <motion.div
            className="element"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="overlay"></div>
            <div className="content">
              <motion.span
                className="text-title"
                variants={waveEffect}
                initial="hidden"
                animate="visible"
              >
                Khám phá những nội dung đa dạng và độc đáo tại PinCap
              </motion.span>
              <motion.p
                className="text-description"
                variants={waveEffect}
                initial="hidden"
                animate="visible"
              >
                Khả năng chỉnh sửa linh hoạt, công cụ AI diệu kỳ
              </motion.p>
            </div>
            <motion.div className="video-container">
              <video src={VideoLandingPage} autoPlay loop muted></video>
            </motion.div>
          </motion.div>

          {/* Section 2 */}
          <div
            className="element"
            style={{ background: "#EEF5FF", padding: "2rem 0" }}
          >
            <div className="banner-flex-image">
              <img
                className="image-border"
                src="https://i.pinimg.com/564x/9d/74/2f/9d742f523389564937f495263972199c.jpg"
              />
              <div className="content-banner">
                <div className="content-banner-title">
                  Tìm kiếm các ý tưởng từ những hình ảnh
                </div>
                <div className="content-banner-description">
                  Khám phá và khơi nguồn cảm hứng từ thế giới xung quanh thông
                  qua việc tìm kiếm ý tưởng từ những hình ảnh tuyệt vời.
                </div>
                <button className="content-banner-button">Khám phá</button>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div
            className="element"
            style={{ background: "rgba(162, 87, 114, 1)", padding: "2rem 0" }}
          >
            <div className="banner-flex-video" style={{ color: "white" }}>
              <div className="content-banner">
                <div className="content-banner-title-reverse">
                  Tìm kiếm các ý tưởng từ những video
                </div>
                <div className="content-banner-description-reverse">
                  Khám phá nguồn cảm hứng không giới hạn từ các video đa dạng
                  trên mạng, để tạo ra những ý tưởng mới và sáng tạo.
                </div>
                <button className="content-banner-button-reverse">
                  Khám phá
                </button>
              </div>
              <div className="videos">
                <video
                  className="image-border"
                  src="https://v1.pinimg.com/videos/mc/720p/dc/8e/90/dc8e90ae0e945a44105c06f6beca858b.mp4"
                  autoPlay
                  loop
                  muted
                ></video>
                <video
                  className="image-border"
                  src="https://v1.pinimg.com/videos/mc/720p/7a/c0/fd/7ac0fd6016b5d4d8494430902803c07c.mp4"
                  autoPlay
                  loop
                  muted
                ></video>
              </div>
            </div>
          </div>
        </Row>
      </Layout>
    </>
  );
};

export default Home;
