import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./index.less";
import { Button, Layout, Row } from "antd";
import HeaderCommon from "../../components/header/HeaderCommon";
import PinCap from "../PinCap/PinCap";
import { Parallax } from 'react-parallax'
import { Link, Element, scroller } from 'react-scroll';
import './index.less'
import VideoLandingPage from "../../assets/videos/VideoPinCapAI.mp4"
import { color } from "framer-motion";
const Home = () => {
  const location = useLocation();

  const [isImageVisible, setImageVisible] = useState(true);
  const [isVideoVisible, setVideoVisible] = useState(false);

  const handleImageTextHover = () => {
    setImageVisible(true);
    setVideoVisible(false);
  };

  const handleVideoTextHover = () => {
    setImageVisible(false);
    setVideoVisible(true);
  };


  return (
    <Layout className='main-layout' >
      <Row className='home-layout'>
        {/* Section 1 */}
        <Element name="section1" className="element">
          <Link to="section1" smooth={true} duration={500}>
            <div className="overlay"></div>
            <video src={VideoLandingPage} autoPlay loop muted></video>
            <div className="content">
              <span className='text-title'>Khám phá những nội dung đa dạng và độc đáo tại PinCap</span>
              <p className='text-description'>Khả năng chỉnh sửa linh hoạt, công cụ AI diệu kỳ</p>
            </div>
          </Link>
        </Element>

        {/* Section 2 */}
        <Element name="section2" className="element" style={{ background: '#EEF5FF' }}>
          <Link to="section2" smooth={true} duration={500}>
            <div className='banner-flex-image'>
              <img className='image-border' src="https://i.pinimg.com/564x/9d/74/2f/9d742f523389564937f495263972199c.jpg" />
              <div className='content-banner'>
                <div className='content-banner-title'>Tìm kiếm các ý tưởng từ những hình ảnh</div>
                <div className='content-banner-description'>Khám phá và khơi nguồn cảm hứng từ thế giới xung quanh thông qua việc tìm kiếm ý tưởng từ những hình ảnh tuyệt vời.</div>
                <Button className='content-banner-button'>Khám phá</Button>
              </div>
            </div>
          </Link>
        </Element>

        {/* Section 3 */}
        <Element name="section3" className="element" style={{ background: 'rgba(162, 87, 114, 1)' }}>
          <Link to="section3" smooth={true} duration={500}>
            <div className='banner-flex-video' style={{ color: "white" }}>
              <div className='content-banner'>
                <div className='content-banner-title-reverse'>Tìm kiếm các ý tưởng từ những video</div>
                <div className='content-banner-description-reverse'>Khám phá nguồn cảm hứng không giới hạn từ các video đa dạng trên mạng, để tạo ra những ý tưởng mới và sáng tạo.</div>
                <Button className='content-banner-button-reverse'>Khám phá</Button>
              </div>
              <div className="videos">
                <video className='image-border' src="https://v1.pinimg.com/videos/mc/720p/dc/8e/90/dc8e90ae0e945a44105c06f6beca858b.mp4" autoPlay loop muted></video>
                <video className='image-border' src="https://v1.pinimg.com/videos/mc/720p/7a/c0/fd/7ac0fd6016b5d4d8494430902803c07c.mp4" autoPlay loop muted></video>
              </div>


            </div>
          </Link>
        </Element>

        {/* Thêm các Section khác nếu cần */}
        {/* <Element name="section4" className="element">
          <Link to="section4" smooth={true} duration={500}>
            <div className='banner-end'>
              <div className='banner-end-title'>Apply artificial intelligence to create high quality photos and videos.</div>
              <div className='banner-end-content' id='media-container'>
                <div>
                  <p onMouseEnter={handleImageTextHover}
                    className='content-banner-text' id="image-text">Apply artificial intelligence to create high quality images.</p>
                  <p onMouseEnter={handleVideoTextHover} className='content-banner-text' id="video-text">Apply artificial intelligence to create high quality videos.</p>
                  <Button className='content-banner-button'>Explore</Button>
                </div>
                <div>
                  {/* <img className='banner-end-media' id='image' src="https://i.pinimg.com/564x/b4/24/8f/b4248faa6794305b62b94616221d2785.jpg" alt="xin chào" />
                      <video className='banner-end-media'  controls id="video">
                        <source src="C:\Users\ADMIN\Downloads\video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video> */}
                  {/* {isImageVisible && (
                    <img
                      className="banner-end-media"
                      id="image"
                      src="https://i.pinimg.com/564x/b4/24/8f/b4248faa6794305b62b94616221d2785.jpg"
                      alt="Hello"
                    />
                  )}
                  {isVideoVisible && (
                    <video className="banner-end-media" controls id="video" autoPlay>
                      <source src="./videos/video.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </Element> */} 
      </Row>

    </Layout>

  )
}

export default Home