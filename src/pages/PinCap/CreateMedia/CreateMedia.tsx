import React, { useState } from "react";
import "./index.less";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Upload,
  UploadFile,
  UploadProps,
  Image,
} from "antd";
import Title from "antd/es/typography/Title";
import { ArrowUpOutlined, PlusOutlined } from "@ant-design/icons";
import { createMedia } from "../../../api/media";
import { GetProps, useSelector } from "react-redux";

type FileType = Parameters<GetProps<UploadProps, "beforeUpload">>[0];

const CreateMedia = () => {
  const [form] = Form.useForm();
  const tokenPayload = useSelector((state: any) => state.auth);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // ANTD
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewMp4, setPreviewMp4] = useState<string>("");

  const [valueForm, setValueForm] = useState<any>({
    medias: [],
    mediaName: "",
    description: "",
    privacy: "",
    mediaOwner_id: "",
    type: "1",
    tagName: [],
    isCreated: 0,
  });

  const handleGenerateClick = () => {
    const formValue = form.getFieldsValue(valueForm);

    const valueAPI = {
      ...valueForm,
      mediaOwner_id: tokenPayload.id,
      medias: fileList[0]["originFileObj"],
      mediaName: formValue.mediaName,
      description: formValue.description,
      privacy: formValue.privacy,
      tagName: "",
      isCreated: 1,
    };

    createNewMedia(valueAPI);
    setIsLoad(true);
  };

  const createNewMedia = async (valueForm: any) => {
    try {
      const response = await createMedia(valueForm);
      if (response) {
        setIsLoad(false);
      }
    } catch (error) {}
  };
  return (
    <div className="create-media-container">
      <Row className="field-create-media">
        <Col>
          <Title style={{ margin: 0 }} level={4}>
            Create Media
          </Title>
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
        {isLoad && (
          <div className="publish-loading">
            <Spin tip="Loading..."></Spin>
          </div>
        )}
        <Form
          className={`form-create-media ${isLoad ? "set-opacity" : ""}`}
          form={form}
          disabled={isLoad}
        >
          <Col span={10} className="upload-image">
            <Form.Item
              name="medias"
              getValueFromEvent={(e) => {
                return e?.fileList;
              }}
            ></Form.Item>
          </Col>
          <Col span={14} className="field-input">
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
