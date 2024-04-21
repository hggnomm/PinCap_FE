import React, { useEffect, useState } from "react";
import "./index.less";
import { Button, Col, Form, Input, Row, Select, Upload } from "antd";
import Title from "antd/es/typography/Title";
import { UploadOutlined } from "@ant-design/icons";
import { createMedia } from "../../../api/media";

const CreateMedia = () => {
  const [form] = Form.useForm();
  const [valueForm, setValueForm] = useState({
    medias: null,
    mediaName: "",
    description: "",
    privact: "",
  });
  const handleGenerateClick = () => {
    const value = form.getFieldsValue(valueForm);
    // console.log(value);
    createNewMedia(value);

    // setValueForm(value)
  };
  useEffect(() => {
    // createImage(valueForm);
    // console.log(valueForm.medias.file)
  }, [valueForm]);

  const createNewMedia = async (valueForm) => {
    await createMedia(valueForm);
    // if (data) {
    //   setIsGenerate(true);
    //   setimageAI(data);
    // }
  };
  return (
    <div className="create-media-container">
      <Row className="field-create-media">
        <Col>
          <Title level={4}>Create Media</Title>
        </Col>
        <Col>
          <Button
            onClick={() => handleGenerateClick()}
            className="btn-publish-media"
          >
            Publish
          </Button>
        </Col>
      </Row>

      <Row className="field-form-create-media">
        <Form className="form-create-media" form={form}>
          <Col span={9} className="upload-image">
            <Form.Item
              name="medias"
              getValueFromEvent={(e) => {
                return e?.fileList;
              }}
            >
              <Upload
                beforeUpload={(file) => {
                  return new Promise((resolve, reject) => {
                    if (file.size > 2) {
                      reject("File size exceeded");
                    } else {
                      resolve("success");
                    }
                  });
                }}
              >
                <Button htmlType="submit">Upload Media</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={15} className="field-input">
            <div className="field-item">
              <span className="text-label">Title</span>
              <Form.Item name="mediaName">
                <Input placeholder="Please input your media name" />
              </Form.Item>
            </div>
            <div className="field-item">
              <span className="text-label">Description</span>
              <Form.Item name="description">
                <Input placeholder="Please input description media" />
              </Form.Item>
            </div>

            <div className="field-item">
              <span className="text-label">Privacy</span>
              <Form.Item name="privacy">
                <Select
                  options={[
                    { value: "1", label: "Public" },
                    { value: "0", label: "Private" },
                  ]}
                />
              </Form.Item>
            </div>
          </Col>
        </Form>
      </Row>
    </div>
  );
};

export default CreateMedia;
