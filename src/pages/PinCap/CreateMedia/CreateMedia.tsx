import React, { useState } from "react";
import "./index.less";
import { Button, Col, Form, Input, Row, Select, Spin, Drawer, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { createMedia, updatedMedia } from "../../../api/media";
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
import DraftMedia from "./DraftMedia";

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
  id?: string;
  media: File | null;
  media_name: string;
  description: string;
  privacy: string;
  mediaOwner_id: string;
  type: string;
  tags_name: string[];
  is_created: number;
  is_comment: boolean;
}

const CreateMedia: React.FC = () => {
  const [form] = Form.useForm();
  const tokenPayload = useSelector((state: any) => state.auth) as TokenPayload;
  const [isLoad, setIsLoad] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      const newTag = input.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        form.resetFields(["tags_name"]);
      }
    }
  };

  const handleGenerateClick = async () => {
    const formValue = form.getFieldsValue(true);
    if (!fileList.length && !formValue.id)
      return toast.error("Please upload an image or media file.");
    if (!formValue.media_name)
      return toast.error("Please provide a name for the media.");

    const tags_name = tags.filter((tag) => tag.trim() !== "");

    const mediaData: MediaFormValues = {
      ...formValue,
      mediaOwner_id: tokenPayload.id,
      media: fileList[0],
      tags_name: tags_name,
      is_created: 1,
      is_comment: 1,
    };

    try {
      setIsLoad(true);

      if (formValue.id) {
        delete mediaData.media;
        console.log(mediaData);
        const response = await updatedMedia(formValue.id, mediaData);
        if (response) {
          setIsLoad(false);
          toast.success("Media updated successfully!");
        } else {
          toast.error("Error: Failed to update media.");
        }
      } else {
        // Nếu không có ID, thì tạo mới
        const response = await createMedia(mediaData);
        if (response) {
          setIsLoad(false);
          toast.success("Media created successfully!");
        } else {
          toast.error(
            "Error: Occurred while creating media, please send report to admin"
          );
        }
      }
    } catch (error: any) {
      toast.error(
        `Error: ${error?.message || "An unexpected error occurred."}`
      );
    } finally {
      setIsLoad(false);
      resetForm();
    }
  };

  const resetForm = () => {
    form.resetFields();
    setFileList([]);
    setTags([]);
    setDrawerVisible(false);
  };

  // Hàm xử lý khi người dùng chọn media từ DraftMedia
  const handleSelectMedia = (media: any) => {
    // Nếu media có id, cập nhật id vào form
    form.setFieldsValue({
      media_name: media.media_name,
      description: media.description,
      privacy: "0",
      tags_name: [],
      id: media.id,
    });
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
          className={`form-create-media ${isLoad ? "set-opacity" : ""}`}
        >
          <Col span={10} className="upload-image">
            <Form.Item name="medias" getValueFromEvent={(e) => e?.fileList}>
              <FilePond
                files={fileList}
                onupdatefiles={(fileItems) =>
                  setFileList(fileItems.map((item) => item.file))
                }
                allowMultiple={false}
                maxFileSize="50MB"
                acceptedFileTypes={["image/*", "video/*"]}
                labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
              />
            </Form.Item>
          </Col>
          <Col span={14} className="field-input">
            <div className="field-item">
              <span className="text-label">Title</span>
              <Form.Item
                name="media_name"
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
                <Input.TextArea
                  rows={5}
                  placeholder="Type description"
                  autoSize={{ minRows: 2, maxRows: 5 }}
                />
              </Form.Item>
            </div>
            <div className="field-item">
              <span className="text-label">Privacy</span>
              <Form.Item name="privacy">
                <Select defaultValue="0" className="custom-select">
                  <Select.Option value="1">Public</Select.Option>
                  <Select.Option value="0">Private</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="field-item">
              <span className="text-label">Tags</span>
              <Form.Item name="tags_name">
                <Input
                  onKeyDown={handleTagInput}
                  placeholder={
                    tags.length >= 10
                      ? "Maximum 10 cards, no more can be added"
                      : "Search for tags or create new ones"
                  }
                  disabled={tags.length >= 10}
                />
              </Form.Item>
              <div className="tags-display">
                {tags.map((tag, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => setTags(tags.filter((t) => t !== tag))}
                    className="custom-tag"
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </Col>
        </Form>
      </Row>

      <Drawer
        title={`Drafts Media (2)`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
      >
        <DraftMedia
          resetFormAndCloseDrawer={resetForm}
          onSelectMedia={handleSelectMedia}
        />
      </Drawer>
    </div>
  );
};

export default CreateMedia;
