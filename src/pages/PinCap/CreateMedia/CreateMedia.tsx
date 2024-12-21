import React, { useState } from "react";
import "./index.less";
import { Button, Col, Form, Input, Row, Select, Spin, Drawer } from "antd";
import Title from "antd/es/typography/Title";
import { createMedia } from "../../../api/media";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles

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
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [valueForm, setValueForm] = useState<MediaFormValues>({
    media: null,
    mediaName: "",
    description: "",
    privacy: "0", // default private
    mediaOwner_id: "",
    type: "1",
    tagName: [],
    is_created: 1,
  });

  const handleGenerateClick = () => {
    const formValue = form.getFieldsValue(true);

    // Kiểm tra nếu không có ảnh hoặc tên thì thông báo lỗi
    if (fileList.length === 0) {
      toast.error("Please upload an image or media file.");
      return;
    }

    if (!formValue.mediaName) {
      toast.error("Please provide a name for the media.");
      return;
    }
    const valueAPI: MediaFormValues = {
      ...valueForm,
      mediaOwner_id: tokenPayload.id,
      media: fileList[0],
      mediaName: formValue.mediaName,
      description: formValue.description,
      privacy: formValue.privacy || "0",
      tagName: [],
      is_created: 1,
    };
    createNewMedia(valueAPI);
    setIsLoad(true);
  };

  const createNewMedia = async (valueForm: MediaFormValues) => {
    try {
      const response = await createMedia(valueForm);
      if (response) {
        setIsLoad(false);
        toast.success("Media created successfully!");
      }
    } catch (error: any) {
      console.error("Error creating media:", error);
      setIsLoad(false);
      toast.error(
        `Error: ${error?.message || "An unexpected error occurred."}`
      );
    }
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
          className={`form-create-media ${isLoad ? "set-opacity" : ""}`}
          form={form}
          disabled={isLoad}
        >
          <Col span={10} className="upload-image">
            <Form.Item name="medias" getValueFromEvent={(e) => e?.fileList}>
              <FilePond
                files={fileList.map((file) => ({
                  source: file,
                  options: { type: "local" },
                }))}
                onupdatefiles={(fileItems) =>
                  setFileList(fileItems.map((fileItem) => fileItem.file))
                }
                allowMultiple={false}
                maxFileSize="50MB"
                acceptedFileTypes={["image/*", "video/*"]}
                allowFileTypeValidation={true}
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
                  {
                    required: true,
                    message: "Please input your media name!",
                  },
                ]}
              >
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
                  defaultValue="0" // Mặc định là private
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

      <Drawer
        title="Drafts"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={500}
      >
        <p>Here are your drafts.</p>
        <p>You can display draft items or other relevant information here.</p>
      </Drawer>
    </div>
  );
};

export default CreateMedia;
