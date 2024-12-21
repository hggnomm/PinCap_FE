import React, { useState } from "react";
import "./index.less";
import { Button, Col, Form, Input, Row, Select, Spin, Drawer } from "antd";
import Title from "antd/es/typography/Title";
import { createMedia } from "../../../api/media";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize,
  FilePondPluginImageEdit,
  FilePondPluginMediaPreview
);

// Types
interface TokenPayload {
  id: string;
}

interface MediaFormValues {
  media: File | null;
  mediaName: string;
  description: string;
  privacy: string;
  mediaOwner_id: string;
  type: string;
  tagName: string[];
  is_created: number;
}

const CreateMedia: React.FC = () => {
  const [form] = Form.useForm();
  const tokenPayload = useSelector((state: any) => state.auth) as TokenPayload;
  const [isLoad, setIsLoad] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleGenerateClick = async () => {
    const formValue = form.getFieldsValue(true);

    // Validate file and media name
    if (!fileList.length)
      return toast.error("Please upload an image or media file.");
    if (!formValue.mediaName)
      return toast.error("Please provide a name for the media.");

    const mediaData: MediaFormValues = {
      ...formValue,
      mediaOwner_id: tokenPayload.id,
      media: fileList[0],
      tagName: [],
      is_created: 1,
    };

    try {
      setIsLoad(true);
      const response = await createMedia(mediaData);
      if (response) {
        setIsLoad(false);
        toast.success("Media created successfully!");
      } else {
        toast.error(
          `Error: Occurred while creating image, please send report to admin"`
        );
      }
    } catch (error: any) {
      toast.error(
        `Error: ${error?.message || "An unexpected error occurred."}`
      );
    } finally {
      setIsLoad(false);
    }
  };

  return (
    <div className="create-media-container">
      <Row className="field-create-media">
        <Col>
          <Title level={4} style={{ margin: 0 }}>
            Create Media
          </Title>
        </Col>
        <Col>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button onClick={handleGenerateClick} className="btn-publish-media">
              Publish
            </Button>
            <Button
              onClick={() => setDrawerVisible(true)}
              className="btn-open-draft"
            >
              Draft
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="field-form-create-media">
        {isLoad && (
          <div className="publish-loading">
            <Spin tip="Loading..." />
          </div>
        )}
        <Form
          form={form}
          disabled={isLoad}
          className={`form-create-media ${isLoad ? "set-opacity" : ""}`}
        >
          <Col span={10} className="upload-image">
            <Form.Item name="medias" getValueFromEvent={(e) => e?.fileList}>
              <FilePond
                files={fileList.map((file) => ({
                  source: file,
                  options: { type: "local" },
                }))}
                onupdatefiles={(fileItems) =>
                  setFileList(fileItems.map((item) => item.file))
                }
                allowMultiple={false}
                maxFileSize="50MB"
                acceptedFileTypes={["image/*", "video/*"]}
                allowFileTypeValidation
                labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
              />
            </Form.Item>
          </Col>
          <Col span={14} className="field-input">
            <div className="field-item">
              <span className="text-label">Title</span>
              <Form.Item
                name="mediaName"
                rules={[
                  { required: true, message: "Please input your media name!" },
                ]}
              >
                <Input placeholder="Type media name" />
              </Form.Item>
            </div>
            <div className="field-item">
              <span className="text-label">Description</span>
              <Form.Item name="description">
                <Input placeholder="Type description" />
              </Form.Item>
            </div>
            <div className="field-item">
              <span className="text-label">Privacy</span>
              <Form.Item name="privacy">
                <Select defaultValue="0">
                  <Select.Option value="1">Public</Select.Option>
                  <Select.Option value="0">Private</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </Col>
        </Form>
      </Row>

      <Drawer
        title="Drafts"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={500}
      >
        <p>Here are your drafts.</p>
      </Drawer>
    </div>
  );
};

export default CreateMedia;
