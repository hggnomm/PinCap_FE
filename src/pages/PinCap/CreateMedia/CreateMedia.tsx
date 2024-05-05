import React, { useEffect, useState } from "react";
import "./index.less";
import { Alert, Button, Col, Form, Input, Row, Select, Spin, Upload } from "antd";
import Title from "antd/es/typography/Title";
import { UploadOutlined } from "@ant-design/icons";
import { createMedia } from "../../../api/media";
import { useSelector } from "react-redux";

const CreateMedia = () => {
  const [form] = Form.useForm();
  const tokenPayload = useSelector((state) => state.auth);
  const [isLoad, setIsLoad] = useState<boolean>(false);

  const [valueForm, setValueForm] = useState<any>({
    medias: null,
    mediaName: "",
    description: "",
    privacy: "",
    mediaOwner_id: "",
    type: "1",
    tagName: [],
    isCreated: 0
  });



  const handleGenerateClick = () => {
    const formValue = form.getFieldsValue(valueForm);

    const valueAPI = {
      ...valueForm,
      mediaOwner_id: tokenPayload.id,
      medias: formValue.medias,
      mediaName: formValue.mediaName,
      description: formValue.description,
      privacy: formValue.privacy,
      tagName: "Ảnh cứt",
      isCreated: 1
    }

    createNewMedia(valueAPI);
  };

  const createNewMedia = async (valueForm) => {
    await createMedia(valueForm);

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
        {isLoad &&
          <div className="publish-loading">
            <Spin tip="Loading..." >

            </Spin>
          </div>

        }
        {/* <Form className="form-create-media" form={form}> */}
        <Form className={`form-create-media ${isLoad ? 'set-opacity' : ""}`} form={form} disabled={isLoad}>
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
