import {
  Button,
  Col,
  Divider,
  Form,
  FormProps,
  Input,
  notification,
  Row,
  Dropdown,
  Menu,
} from "antd";
import React, { useState } from "react";
import "./index.less";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import Image1 from "../../../assets/img/ImagesAI/img1.png";
import Image2 from "../../../assets/img/ImagesAI/img2.png";
import Image3 from "../../../assets/img/ImagesAI/img3.png";
import Image4 from "../../../assets/img/ImagesAI/img4.png";
import Image5 from "../../../assets/img/ImagesAI/img5.png";
import { motion } from "framer-motion";
import { options, sizeOptions } from "../../../utils/options";

interface IRequest {
  textInput: string;
  style_preset: string;
  timeCurrent: string;
  size: number;
}

const ImageList = [Image1, Image2, Image3, Image4, Image5];

type FieldType = IRequest;

interface IRequestCreateAIImage {
  textInput: string;
  style_preset: string;
  timeCurrent: string;
  size: string;
}

const ImageAi = () => {
  const [form] = Form.useForm();
  const [selectedOptions, setSelectedOptions] = useState<any>(null);
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [isDoneGenerate, setIsDoneGenerate] = useState<boolean>(false);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const currentTime = new Date().toLocaleString();
    const updatedRequest: IRequestCreateAIImage = {
      textInput: values.textInput,
      style_preset: selectedStyle?.label || "",
      timeCurrent: currentTime,
      size: selectedOptions?.label || "",
    };

    setIsDoneGenerate(true);

    console.log("Generated Values:", updatedRequest);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    notification.error({
      message: "Form submission failed",
      description: "Please check the form fields and try again.",
    });
    console.log("Failed:", errorInfo);
  };

  // Menu cho dropdown
  const menu = (
    <Menu
      style={{
        maxHeight: "300px", // Set the desired maximum width
        overflowX: "auto", // Allow horizontal scrolling if items overflow
        whiteSpace: "nowrap", // Prevent text from wrapping to the next line
      }}
    >
      {options.slice(4).map((option, index) => (
        <Menu.Item key={index} onClick={() => handleMenuClick(option)}>
          <img
            src={option.image}
            alt={option.label}
            style={{ width: 40, marginRight: 13 }}
          />
          {option.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Xử lý khi người dùng chọn item từ dropdown
  const handleMenuClick = (option: any) => {
    setSelectedStyle(option);
    form.setFieldsValue({ style_preset: option.label });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      transition={{ duration: 1 }}
      className="container"
    >
      <div className="main-page">
        <div className="left-side">
          <Form
            form={form}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="form"
          >
            <div>
              <Row className="field-input">
                <span>Create an image from text prompt</span>
                <Form.Item<FieldType>
                  name="textInput"
                  rules={[{ required: true, message: "Please enter text!" }]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter your prompt"
                    autoSize={{ minRows: 1, maxRows: 3 }}
                  />
                </Form.Item>
              </Row>

              <Row className="field-input">
                <span>Choose a size</span>
                <Form.Item<FieldType>
                  name="size"
                  rules={[{ required: true, message: "Please choose a size!" }]}
                >
                  <div className="options">
                    {sizeOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedOptions(option);
                          form.setFieldsValue({ size: option.label });
                        }}
                        className={`options-item ${
                          selectedOptions?.label === option.label
                            ? "selected"
                            : ""
                        }`}
                      >
                        <img src={option.image} alt={option.label} />
                      </div>
                    ))}
                  </div>
                </Form.Item>
              </Row>

              <Row className="field-input">
                <span>Choose a style</span>
                <Form.Item<FieldType>
                  name="style_preset"
                  rules={[
                    { required: true, message: "Please choose a style!" },
                  ]}
                >
                  <div className="options">
                    {/* Hiển thị 4 item đầu tiên */}
                    {options.slice(0, 4).map((option, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedStyle(option);
                          form.setFieldsValue({ style_preset: option.label });
                        }}
                        className={`options-item ${
                          selectedStyle?.label === option.label
                            ? "selected"
                            : ""
                        }`}
                      >
                        <img src={option.image} alt={option.label} />
                      </div>
                    ))}
                    {/* Dropdown hiển thị các item còn lại */}
                  </div>
                  <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    className="more-styles"
                  >
                    <Button>
                      {selectedStyle ? selectedStyle.label : "More"}
                    </Button>
                  </Dropdown>
                </Form.Item>
              </Row>
            </div>

            <Form.Item>
              <Button className="btn-generate" type="primary" htmlType="submit">
                Generate
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className="right-side">
          <Row>
            {isDoneGenerate ? (
              <Swiper className="swiper-images">
                <SwiperSlide className="image-item">
                  <img src={Image5} alt="Generated Image" />
                </SwiperSlide>
              </Swiper>
            ) : (
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                modules={[Autoplay, FreeMode, Pagination]}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={true}
                className="swiper-images"
              >
                {ImageList.map((image, index) => (
                  <SwiperSlide key={index} className="image-item">
                    <img src={image} alt="" />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Row>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageAi;
