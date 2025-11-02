import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  Button,
  Form,
  FormProps,
  Input,
  notification,
  Row,
  Dropdown,
  Menu,
} from "antd";

import "./index.less";

import { createAIImage } from "@/api/ai";
import Image1 from "@/assets/img/ImagesAI/img1.png";
import Image2 from "@/assets/img/ImagesAI/img2.png";
import Image3 from "@/assets/img/ImagesAI/img3.png";
import Image4 from "@/assets/img/ImagesAI/img4.png";
import Image5 from "@/assets/img/ImagesAI/img5.png";
import Loading from "@/components/Loading/Loading";
import { options, sizeOptions } from "@/utils/options";

interface IRequest {
  textInput: string;
  style_preset: string;
  timeCurrent: string;
  size: number;
}

const ImageList = [Image1, Image2, Image3, Image4, Image5];

type FieldType = IRequest;

interface IRequestCreateAIImage {
  prompt: string;
  style_preset: string;
  width: number;
  height: number;
  imageUrl?: string | null;
  imageData?: string | null;
}

const ImageAi = () => {
  const [form] = Form.useForm();
  const [selectedOptions, setSelectedOptions] = useState<
    (typeof sizeOptions)[number] | null
  >(null);
  const [selectedStyle, setSelectedStyle] = useState<
    (typeof options)[number] | null
  >(null);
  const [isDoneGenerate, setIsDoneGenerate] = useState<boolean>(false);
  const [isGenerate, setIsGenerate] = useState<boolean>(false);
  const [urlImageAi, setUrlImageAI] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.removeItem("generatedImageUrl");
  }, []);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    setError(null);
    setIsGenerate(true);

    try {
      const updatedRequest: IRequestCreateAIImage = {
        prompt: values.textInput,
        style_preset: selectedStyle?.value || "",
        width: selectedOptions?.value.width ?? 0,
        height: selectedOptions?.value.height ?? 0,
        imageUrl: localStorage.getItem("generatedImageUrl") || null,
      };

      const response = await createAIImage(updatedRequest);

      if (response.status === "succeeded") {
        setUrlImageAI(response.imageUrl);
        setIsDoneGenerate(true);
        setIsGenerate(false);
        localStorage.setItem("generatedImageUrl", response.imageUrl);
      } else {
        throw new Error("Failed to generate image. Please try again.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(
          err.message || "An error occurred while generating the image."
        );
      } else {
        console.error(err);
        setError("An error occurred while generating the image.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi form submission bị lỗi
  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    notification.error({
      message: "Form submission failed",
      description: "Please check the form fields and try again.",
    });
    console.log("Failed:", errorInfo);
  };

  const handleReload = () => {
    form.resetFields(); // Reset lại form
    localStorage.removeItem("generatedImageUrl");
    setUrlImageAI(null);
    setIsDoneGenerate(false);
    setIsGenerate(false);
  };

  // Menu cho dropdown
  const menu = (
    <Menu
      style={{
        maxHeight: "300px",
        overflowX: "auto",
        whiteSpace: "nowrap",
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

  const handleMenuClick = (option: (typeof options)[number]) => {
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
                    autoSize={{ minRows: 2, maxRows: 6 }}
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

            {/* Nút reload */}
            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button type="default" onClick={handleReload}>
                Reload Form
              </Button>
            </Form.Item>

            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button
                className="btn-generate"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Generate
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className="right-side">
          <Row className="image-ai-container">
            {isDoneGenerate || isGenerate ? (
              <div>
                <Loading isLoading={loading}>
                  <img src={urlImageAi ?? ""} className="image-ai" />
                </Loading>
              </div>
            ) : (
              <Swiper
                slidesPerView={1}
                spaceBetween={10}
                modules={[Autoplay, FreeMode, Pagination]}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className="swiper-images"
              >
                {ImageList.map((image, index) => (
                  <SwiperSlide key={index} className="image-item">
                    <img src={image} alt={`Image ${index + 1}`} />
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
