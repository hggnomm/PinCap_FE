import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./index.less";
import { Button, Layout, Row } from "antd";
import HeaderCommon from "../../components/header/HeaderCommon";
import SiderCommon from "../../components/sider/SiderCommon";
import PinCap from "../PinCap/PinCap";
import { Parallax } from 'react-parallax'
import { Link, Element, scroller  } from 'react-scroll';
import '../../styles/review.css'

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


  useEffect(() => {
    document.title = "Pincap"
    var targetSection = "section"
    var i = 1
    const handleScroll = (event) => {
      const isScrollingDown = event.deltaY > 0;

      
      // Kiểm tra hướng cuộn
      if (isScrollingDown > 0) {
        i = i+1
        scroller.scrollTo(targetSection+i, {
          duration: 500,
          smooth: true,
        });
        console.log('Cuộn xuống');
      } else if (event.deltaY < 0) {
        i = i-1
        scroller.scrollTo(targetSection+i, {
          duration: 500,
          smooth: true,
          
        });
        console.log('Cuộn lên');
      }
      if(i>4) i = 4
      if(i<0) i = 0
    };

    // Thêm sự kiện lắng nghe cuộn chuột
    window.addEventListener('wheel', handleScroll);

    // Xóa sự kiện lắng nghe khi component unmount để tránh memory leak
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [])
  return (
    <Layout className='main-layout' >
      <HeaderCommon />
      <Row className='home-layout'>
        {/* <TableCampaign/> */}
        <div className='home  '>
          {/* Section 1 */}
            <Element name="section1" className="element" >
              <Link to="section1" smooth={true} duration={500}>
                <div className="image-with-text-container">
                  <img src="https://i.pinimg.com/736x/b4/71/c9/b471c930dc4d2c485bcb30e18ffcd994.jpg" alt="Background" className="background-image" />
                 <div className="text-overlay">
                    <span className='text-title text-rose-600'>The free, versatile video editor allows anyone to create anything, anywhere</span>
                    <p className='text-description'>Flexible editing capabilities, magical AI tools</p>
                 </div>
     
                </div>
              </Link>
            </Element>

        {/* Section 2 */} 
            <Element name="section2" className="element">
              <Link to="section2" smooth={true} duration={500}>
                <div className='banner-flex'>
                  <img className='image-border' src="https://i.pinimg.com/564x/fb/ef/3e/fbef3e988446790706b0908bf892abdb.jpg" alt="xin chào" />
                  <div className='content-banner'>
                    <span className='content-banner-title'>Find ideas from photos</span>
                    <p className='content-banner-description'>PINCAP fuels success by providing a dynamic space for innovation and growth. Your journey to success begins here</p>
                    <Button className='content-banner-button'>Explore</Button>
                  </div>
                </div>
              </Link>
            </Element>

        {/* Section 3 */}
            <Element name="section3" className="element">
            <Link to="section3" smooth={true} duration={500}>
                <div className='banner-flex' style={{background:'rgba(162, 87, 114, 1)'}}>
                  <div className='content-banner'>
                    <span className='content-banner-title-reverse'>Find ideas from photos</span>
                    <p className='content-banner-description-reverse'>PINCAP fuels success by providing a dynamic space for innovation and growth. Your journey to success begins here</p>
                    <Button className='content-banner-button-reverse'>Explore</Button>
                  </div>
                  <img className='image-border' src="https://i.pinimg.com/564x/b4/24/8f/b4248faa6794305b62b94616221d2785.jpg" alt="xin chào" />
                </div>
              </Link>
            </Element>

          {/* Thêm các Section khác nếu cần */}
          <Element name="section4" className="element">
            <Link to="section4" smooth={true} duration={500}>
                <div className='banner-end'>
                  <div className='banner-end-title'>Apply artificial intelligence to create high quality photos and videos.</div>
                  <div className='banner-end-content' id='media-container'>
                    <div>
                      <p    onMouseEnter={handleImageTextHover} 
         className='content-banner-text' id="image-text">Apply artificial intelligence to create high quality images.</p>
                      <p    onMouseEnter={handleVideoTextHover}  className='content-banner-text' id="video-text">Apply artificial intelligence to create high quality videos.</p>
                      <Button className='content-banner-button'>Explore</Button>
                    </div>
                    <div>
                      {/* <img className='banner-end-media' id='image' src="https://i.pinimg.com/564x/b4/24/8f/b4248faa6794305b62b94616221d2785.jpg" alt="xin chào" />
                      <video className='banner-end-media'  controls id="video">
                        <source src="C:\Users\ADMIN\Downloads\video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video> */}
                        {isImageVisible && (
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
            </Element>
        </div>
      </Row>
      
    </Layout>

  )
}

export default Home