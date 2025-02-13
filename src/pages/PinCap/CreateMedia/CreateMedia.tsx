import React, { useState, useEffect } from "react";
import "./index.less";
import { Button, Col, Form, Input, Row, Select, Spin, Drawer, Tag } from "antd";
import Title from "antd/es/typography/Title";
import {
  createMedia,
  getDetailMedia,
  getMyMedias,
  updatedMedia,
} from "../../../api/media";
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
import { Media } from "type";
import ProgressiveImage from "react-progressive-image";

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
  media?: File | null;
  media_name: string;
  description: string;
  privacy: string;
  mediaOwner_id: string;
  type: string;
  tags_name: string[];
  is_created: number;
  is_comment: number;
}

const CreateMedia: React.FC = () => {
  const [form] = Form.useForm();
  const tokenPayload = useSelector((state: any) => state.auth) as TokenPayload;
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [isSelectedDraft, setIsSelectedDraft] = useState<boolean>(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(true);
  const [isLoadCreateDraft, setIsLoadCreateDraft] = useState<boolean>(false);
  const [textCreateDraft, setTextCreateDraft] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState("");

  const [drafts, setDrafts] = useState<any[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState<boolean>(false);
  const [draftId, setDraftId] = useState<string>("");

  useEffect(() => {
    return () => {
      fetchDrafts();
    };
  }, []);

  useEffect(() => {
    if (!form.getFieldValue("privacy")) {
      form.setFieldsValue({ privacy: "0" });
    }
  }, [form]);

  useEffect(() => {
    const fetchDraftDetail = async () => {
      if (draftId && drafts.length > 0) {
        try {
          const detailDraft = await getDetailMedia(draftId);
          if (detailDraft) {
            handleSelectMedia(detailDraft);
          }
        } catch (error) {
          toast.error("Error fetching draft details: " + error);
        }
      }
    };

    fetchDraftDetail();
  }, [draftId, drafts]);

  const fetchDrafts = async (isGenerateDraft = false) => {
    setLoadingDrafts(true);
    try {
      const draftList = await getMyMedias(1, 0);
      if (draftList?.data) {
        setDrafts(draftList.data);

        if (isGenerateDraft && draftList.data.length > 0) {
          setDraftId(draftList.data[0].id);
          handleSelectMedia(draftList.data[0]);
        }
      }
    } catch (error) {
      toast.error("Error fetching drafts: " + error);
    } finally {
      setLoadingDrafts(false);
    }
  };

  useEffect(() => {
    if (fileList.length > 0) {
      setIsFormDisabled(false);
    } else if (isSelectedDraft) {
      setIsFormDisabled(false);
    } else {
      setIsFormDisabled(true);
    }
  }, [fileList, isSelectedDraft]);

  useEffect(() => {
    form.setFieldsValue({
      tags_name: tags,
    });
    form.resetFields(["tags_name"]);
  }, [tags, form]);

  const handleTagInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const input = e.target as HTMLInputElement;
      const newTag = input.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
        form.resetFields(["tags_name"]);
      }
    }
  };

  const handleFormChange = () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      onChangeToCreateDraft();
    }, 3000);

    setDebounceTimeout(newTimeout);
  };

  const onChangeToCreateDraft = async () => {
    const formValue = form.getFieldsValue(true);
    const mediaData: MediaFormValues = {
      ...formValue,
      mediaOwner_id: tokenPayload.id,
      media: fileList[0],
      tags_name: tags,
      is_created: 0,
      is_comment: 1,
    };

    setIsLoadCreateDraft(true);
    setTextCreateDraft(true);

    try {
      const response = formValue.id
        ? await updatedMedia(formValue.id, { ...mediaData, media: undefined })
        : await createMedia(mediaData);

      if (response) {
        if (!draftId) {
          fetchDrafts(true);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } catch (error: unknown) {
      toast.error(
        `Error: ${
          error instanceof Error
            ? error.message
            : "An unexpected error occurred."
        }`
      );
    } finally {
      setTextCreateDraft(false);
    }
  };

  const handleGenerateClick = async () => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      setDebounceTimeout(null);
    }

    const formValue = form.getFieldsValue(true);
    if (!fileList.length && !formValue.id)
      return toast.error("Please upload an image or media file.");

    const tags_name = tags;

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
        const response = await updatedMedia(formValue.id, mediaData);
        if (response) {
          setIsLoad(false);
          toast.success("Media updated successfully!");
        } else {
          toast.error("Error: Failed to update media.");
        }
      } else {
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
      setDraftId("");
      fetchDrafts();
      resetForm();
    }
  };

  const resetForm = () => {
    form.resetFields();
    setFileList([]);
    setTags([]);
    setImageUrl("");
    setDrawerVisible(false);
    setIsLoadCreateDraft(false);
    setIsFormDisabled(true);
    setIsSelectedDraft(false);
    setDraftId("");
  };

  const handleSelectMedia = (media: Media) => {
    form.setFieldsValue({
      media_name: media.media_name,
      description: media.description,
      privacy: media.privacy == "PUBLIC" ? "1" : "0",
      tags_name: media.tags_name,
      id: media.id,
    });

    setImageUrl(media.media_url);
    setIsSelectedDraft(true);
    setFileList([]);
  };

  return (
    <div className="create-media-container">
      <div className="field-create-media">
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Create Media
          </Title>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLoadCreateDraft &&
              (textCreateDraft ? (
                <div className="text-draft-change">Saving changes...</div>
              ) : (
                <div className="text-draft-change">Changes saved!</div>
              ))}
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
        </div>
      </div>

      <Row className="field-form-create-media">
        {isLoad && (
          <div className="publish-loading">
            <Spin tip="Loading..." />
          </div>
        )}
        <Form
          form={form}
          disabled={isFormDisabled} // Disable form khi isFormDisabled = true
          className={`form-create-media ${isLoad ? "set-opacity" : ""}`}
          onValuesChange={handleFormChange} // Gọi khi có thay đổi
        >
          <Col md={24} xl={10} className="upload-image">
            {imageUrl ? (
              <div className="draft-img">
                <ProgressiveImage src={imageUrl} placeholder={imageUrl}>
                  {(src: any, loading: any) => (
                    <img
                      style={{
                        filter: loading ? "blur(20px)" : "none",
                        transition: "filter 0.3s",
                      }}
                      src={src}
                      alt="media preview"
                    />
                  )}
                </ProgressiveImage>
              </div>
            ) : (
              <Form.Item name="medias" getValueFromEvent={(e) => e?.fileList}>
                <FilePond
                  files={fileList}
                  onupdatefiles={(fileItems) =>
                    setFileList(fileItems.map((item): any => item.file))
                  }
                  allowMultiple={false}
                  maxFileSize="50MB"
                  acceptedFileTypes={["image/*", "video/*"]}
                  labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
                  imagePreviewMaxHeight={1000}
                  imagePreviewMarkupShow
                />
              </Form.Item>
            )}
          </Col>

          <Col md={24} xl={14} className="field-input">
            <div className="field-item-create">
              <span className="text-label">Title</span>
              <Form.Item name="media_name">
                <Input placeholder="Type media name" />
              </Form.Item>
            </div>
            <div className="field-item-create">
              <span className="text-label">Description</span>
              <Form.Item name="description">
                <Input.TextArea
                  rows={5}
                  placeholder="Type description"
                  autoSize={{ minRows: 2, maxRows: 5 }}
                />
              </Form.Item>
            </div>
            <div className="field-item-create">
              <span className="text-label">Privacy</span>
              <Form.Item name="privacy" initialValue="0">
                <Select className="custom-select">
                  <Select.Option value="0">Private</Select.Option>
                  <Select.Option value="1">Public</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="field-item-create">
              <span className="text-label">Tags</span>
              <Form.Item name="tags_name">
                <Input
                  onKeyDown={handleTagInput}
                  placeholder={
                    tags.length >= 10
                      ? "Maximum 10 cards, no more can be added"
                      : "Search for tags or create new ones"
                  }
                  disabled={tags.length >= 10 || !fileList.length}
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
        
        title={`Draft Medias (${drafts.length})`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={500}
        // closable={false}
      >
        <DraftMedia
          resetFormAndCloseDrawer={resetForm}
          onSelectMedia={handleSelectMedia}
          drafts={drafts}
          loadingDrafts={loadingDrafts}
        />
      </Drawer>
    </div>
  );
};

export default CreateMedia;
