import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import Image1 from "../../../assets/img/ImagesAI/image1.jpg";
import Image2 from "../../../assets/img/ImagesAI/images2.jpg";
import Image3 from "../../../assets/img/ImagesAI/image3.jpg";
import Image4 from "../../../assets/img/ImagesAI/image4.jpg";
import "./index.less";
import { Button, Col, Form, Input, Radio, Row, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { createImageAI } from "../../../api/ai";

const { Text, Title } = Typography;
const ImageAi = () => {
  const [form] = Form.useForm();
  const [valueForm, setValueForm] = useState({
    size: "",
    prompt: "",
  });
  const [isGenerate, setIsGenerate] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [imageAI, setimageAI] = useState("");

  useEffect(() => {
    if (isSearch) {
      createImage(valueForm);
    }
  }, [valueForm]);
  const createImage = async (valueForm) => {
    const data = await createImageAI(valueForm);
    if (data) {
      setIsGenerate(true);
      setimageAI(data);
    }
    return data;
  };

  const handleGenerateClick = () => {
    const value = form.getFieldsValue(valueForm);
    setValueForm(value);
    setIsSearch(true);
  };

  return (
    <Col className="create-ai-image">
      <div>
        <Title>Create Images From Text</Title>
        <Text type="secondary">
          Use suggestions to create your own AI photo
        </Text>
      </div>
      <Col className="image-review">
        {!isGenerate ? (
          <Swiper
            slidesPerView={3}
            spaceBetween={10}
            freeMode={true}
            pagination={{
              clickable: true,
            }}
            modules={[FreeMode, Pagination]}
            className="swiper-images"
          >
            <SwiperSlide className="image-item">
              <img src={Image1} alt="" />
            </SwiperSlide>
            <SwiperSlide className="image-item">
              <img src={Image2} alt="" />
            </SwiperSlide>
            <SwiperSlide className="image-item">
              <img src={Image3} alt="" />
            </SwiperSlide>
            <SwiperSlide className="image-item">
              <img src={Image4} alt="" />
            </SwiperSlide>
          </Swiper>
        ) : (
          <>
            <img src={imageAI} alt="" />
          </>
        )}
      </Col>
      <div className="create-image-container">
        <Form className="form-create-image" form={form}>
          <Form.Item name="size">
            <Radio.Group optionType="button" className="radio-size-image">
              <Radio className="item-size" value={"1024x1024"}>
                Large
              </Radio>
              <Radio className="item-size" value={"512x512"}>
                Medium
              </Radio>
              <Radio className="item-size" value={"256x256"}>
                Small
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Row className="field-button-generate">
            <Col span={18}>
              <Form.Item name="prompt">
                <TextArea
                  placeholder="Enter text description..."
                  className="input-text"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button onClick={() => handleGenerateClick()}>Generate</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </Col>
  );
};

export default ImageAi;
