import { Button, Col, Divider, Form, FormProps, Input, Row } from "antd";
import React, { useState } from "react";
import "./index.less";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import Image1 from "../../../assets/img/ImagesAI/img1.png";
import Image2 from "../../../assets/img/ImagesAI/img2.png";
import Image3 from "../../../assets/img/ImagesAI/img3.png";
import Image4 from "../../../assets/img/ImagesAI/img4.png";
import Image5 from "../../../assets/img/ImagesAI/img5.png";

interface IRequest {
  textInput: string;
  style_preset: string;
  timeCurrent: string;
  size: number;
}

const ImageList = [Image1, Image2, Image3, Image4, Image5];

type FieldType = IRequest;

const ImageAi = () => {
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [isDoneGenerate, setIsDoneGenerate] = useState<boolean>(false);
  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="container">
      <Row className="main-page" justify="space-between">
        <Col className="left-side" span={10}>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="form"
          >
            <Row className="field-input">
              <span>Create an image from text prompt</span>
              <Form.Item<FieldType>
                name="textInput"
                rules={[{ required: true }]}
                style={{ width: "100%", margin: 0 }}
                noStyle
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Enter your prompt"
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
              </Form.Item>
              <Divider style={{ margin: "12px 0" }} />
            </Row>
            <Row className="field-input">
              <span>Choose a style</span>
              <Form.Item<FieldType>
                name="style_preset"
                rules={[{ required: true }]}
                style={{ width: "100%", margin: 0 }}
                noStyle
              >
                {/* <StyleOptions />
                 */}
                <Input defaultValue="cc" />
              </Form.Item>
              <Divider style={{ margin: "12px 0" }} />
            </Row>
            <Row className="field-input">
              <span>Choose a size</span>
              <Form.Item<FieldType>
                name="style_preset"
                rules={[{ required: true }]}
                style={{ width: "100%", margin: 0 }}
                noStyle
              >
                {/* <StyleOptions />
                 */}
                <Input defaultValue="cc" />
              </Form.Item>
              <Divider style={{ margin: "12px 0" }} />
            </Row>
            <Form.Item>
              <Button className="btn-generate" type="primary" htmlType="submit">
                Generate
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col className="right-side" span={14}>
          <Row>
            {!isDoneGenerate ? (
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                modules={[Autoplay, FreeMode, Pagination]}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                pagination={true}
                className="swiper-images"
              >
                {ImageList.map((image, index) => (
                  <SwiperSlide key={index} className="image-item">
                    <img src={image} alt="" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Swiper className="swiper-images">
                <SwiperSlide className="image-item">
                  <img src={Image5} alt="" />
                </SwiperSlide>
              </Swiper>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default ImageAi;
