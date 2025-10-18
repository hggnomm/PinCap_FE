import React, { useState, useEffect } from "react";
import "./index.less";
import "./FilePond.less";
import { Button, Col, Form, Input, Row, Select, Spin, Drawer, Tag } from "antd";
import Title from "antd/es/typography/Title";
import { getDetailMedia, getMyMedias } from "@/api/media";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import clsx from "clsx";
import { useMedia } from "@/react-query/useMedia";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
// @ts-ignore
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";
import DraftMedia from "./DraftMedia";
import { MediaFormValues } from "@/types/Media/MediaRequest";
import { Media } from "@/types/type";
import ImageEditor from "@/components/imageEditor";
import { EditOutlined } from "@ant-design/icons";
import { MediaResponse } from "@/types/Media/MediaResponse";
import { PRIVACY } from "@/constants/constants";

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

const CreateMedia: React.FC = () => {
  const [form] = Form.useForm();
  const tokenPayload = useSelector((state: any) => state.auth) as TokenPayload;
  const { createMedia, updateMedia } = useMedia();
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [fileList, setFileList] = useState<File[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState<boolean>(false);
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

  // Image Editor states
  const [isImageEditorVisible, setIsImageEditorVisible] =
    useState<boolean>(false);
  const [editingImageSrc, setEditingImageSrc] = useState<string>("");
  const [editingImageIndex, setEditingImageIndex] = useState<number>(-1);

  // Ref for FilePond container
  const filepondRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  useEffect(() => {
    if (!form.getFieldValue("privacy")) {
      form.setFieldsValue({ privacy: PRIVACY.PRIVATE });
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
      const draftList = await getMyMedias({
        pageParam: 1,
        is_created: false,
      });

      if (draftList) {
        setDrafts(draftList);

        if (isGenerateDraft && draftList.length > 0) {
          setDraftId(draftList[0].id);
          handleSelectMedia(draftList[0]);
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
    const mediaData: any = {
      ...formValue,
      mediaOwner_id: tokenPayload.id,
      media: fileList,
      tags_name: tags,
      is_created: false,
      is_comment: 1,
    };

    setIsLoadCreateDraft(true);
    setTextCreateDraft(true);

    try {
      let response: any;
      if (formValue.id) {
        delete mediaData.media;
        response = await updateMedia({ id: formValue.id, data: mediaData });
      } else {
        response = await createMedia(mediaData);
      }

      if (response?.media?.id) {
        setDraftId(response.media.id);
        form.setFieldValue("id", response.media.id);
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

    const mediaData: any = {
      ...formValue,
      mediaOwner_id: tokenPayload.id,
      media: fileList,
      tags_name: tags_name,
      is_created: true,
      is_comment: 1,
    };

    try {
      setIsLoad(true);

      if (formValue.id) {
        delete mediaData.media;
        await updateMedia({ id: formValue.id, data: mediaData });
        toast.success("Media updated successfully!");
      } else {
        await createMedia(mediaData);
        toast.success("Media created successfully!");
      }

      setDraftId("");
      fetchDrafts();
      resetForm();
    } catch (error: any) {
      toast.error(
        `Error: ${error?.message || "An unexpected error occurred."}`
      );
    } finally {
      setIsLoad(false);
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
      privacy: media.privacy == "PUBLIC" ? PRIVACY.PUBLIC : PRIVACY.PRIVATE,
      tags_name: media.tags_name,
      id: media.id,
    });

    setImageUrl(media.media_url);
    setIsSelectedDraft(true);
    setFileList([]);
    setTags(media.tags_name || []);
  };

  const handleOpenImageEditor = (index: number = 0) => {
    let imageSrc = "";

    if (imageUrl && index === 0) {
      // For draft images, use the existing imageUrl (only for first image)
      imageSrc = imageUrl;
    } else if (fileList.length > index) {
      // For newly uploaded files, create object URL for specific index
      imageSrc = URL.createObjectURL(fileList[index]);
    }

    if (imageSrc) {
      setEditingImageSrc(imageSrc);
      setEditingImageIndex(index);
      setIsImageEditorVisible(true);
    }
  };

  const handleImageEdited = (editedBlob: Blob) => {
    // Convert blob to file
    const editedFile = new File([editedBlob], "edited-image.jpg", {
      type: "image/jpeg",
    });

    if (editingImageIndex === 0 && imageUrl) {
      // If editing the first image and it's a draft image
      setFileList([editedFile]);
      setImageUrl("");
      setIsSelectedDraft(false);
    } else {
      // If editing a file from fileList
      const newFileList = [...fileList];
      newFileList[editingImageIndex] = editedFile;
      setFileList(newFileList);
    }

    // Close editor
    setIsImageEditorVisible(false);
    setEditingImageSrc("");
    setEditingImageIndex(-1);
  };

  const handleCloseImageEditor = () => {
    setIsImageEditorVisible(false);
    setEditingImageSrc("");
    setEditingImageIndex(-1);
  };

  useEffect(() => {
    const addEditButtons = () => {
      if (!filepondRef.current) return;

      const filepondItems =
        filepondRef.current.querySelectorAll(".filepond--item");
      filepondItems.forEach((item, index) => {
        if (item.querySelector(".edit-button")) {
          return;
        }

        const imagePreview = item.querySelector(".filepond--image-preview");
        if (imagePreview) {
          const editButton = document.createElement("button");
          editButton.className =
            "edit-button absolute top-2 right-2 !bg-rose-600 hover:!bg-rose-700 !border-rose-600 hover:!border-rose-700 shadow-lg z-10 !p-2 rounded-full flex items-center justify-center border-0 cursor-pointer transition-all duration-200";
          editButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
          editButton.onclick = (e) => {
            e.stopPropagation();
            handleOpenImageEditor(index);
          };
          (item as HTMLElement).style.position = "relative";
          item.appendChild(editButton);
        }
      });
    };

    // Use setTimeout to wait for FilePond to render
    const timer = setTimeout(addEditButtons, 100);

    return () => clearTimeout(timer);
  }, [fileList]);

  return (
    <div className="create-media-container">
      <div
        className={clsx("field-create-media", "sticky top-0 !z-20 bg-white")}
      >
        <div>
          <Title level={4} className="m-0">
            Create Media
          </Title>
        </div>
        <div>
          <div className="flex gap-2.5 justify-center items-center">
            {isLoadCreateDraft && textCreateDraft && (
              <div className="text-draft-change">Saving changes...</div>
            )}
            {isLoadCreateDraft && !textCreateDraft && (
              <div className="text-draft-change">Changes saved!</div>
            )}
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
          className={clsx("form-create-media", {
            "set-opacity": isLoad,
            "!flex-col": fileList.length >= 2,
            // "!flex-row": fileList.length <= 1
          })}
          onValuesChange={handleFormChange} // Gọi khi có thay đổi
        >
          <Col
            md={24}
            xl={fileList.length >= 2 ? 24 : 10}
            className={clsx("upload-image", {
              "!w-full !px-8": fileList.length >= 2,
            })}
          >
            {imageUrl && (
              <div className="draft-img relative">
                <img
                  className="transition-all duration-300"
                  src={imageUrl}
                  alt="media preview"
                />
                {/* <Button
                  type="primary"
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenImageEditor(0)}
                  className="absolute top-2 right-2 !bg-rose-600 hover:!bg-rose-700 !border-rose-600 hover:!border-rose-700 shadow-lg z-10 !p-2"
                  size="large"
                /> */}
              </div>
            )}
            {!imageUrl && (
              <div
                ref={filepondRef}
                className={clsx("relative", {
                  "filepond-grid-wrapper": fileList.length >= 2,
                })}
              >
                <Form.Item name="medias" getValueFromEvent={(e) => e?.fileList}>
                  <FilePond
                    files={fileList}
                    onupdatefiles={(fileItems) => {
                      setFileList(fileItems.map((item): any => item.file));
                      setIsProcessingFiles(false);
                    }}
                    onaddfilestart={() => setIsProcessingFiles(true)}
                    onprocessfiles={() => setIsProcessingFiles(false)}
                    allowMultiple={true}
                    maxFiles={6}
                    maxFileSize="50MB"
                    acceptedFileTypes={["image/*", "video/*"]}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    imagePreviewMarkupShow
                    itemInsertLocation="after"
                  />
                </Form.Item>
              </div>
            )}
          </Col>

          <Col
            md={24}
            xl={fileList.length >= 2 ? 24 : 14}
            className={clsx("field-input", {
              "!w-full !px-8": fileList.length >= 2,
            })}
          >
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
              <Form.Item name="privacy" initialValue={PRIVACY.PRIVATE}>
                <Select className="custom-select">
                  <Select.Option value={PRIVACY.PRIVATE}>Private</Select.Option>
                  <Select.Option value={PRIVACY.PUBLIC}>Public</Select.Option>
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
                  disabled={
                    tags.length >= 10 || (!fileList.length && !isSelectedDraft)
                  }
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
          onDraftDeleted={fetchDrafts}
        />
      </Drawer>

      {/* Image Editor Modal */}
      <ImageEditor
        isVisible={isImageEditorVisible}
        imageSrc={editingImageSrc}
        onClose={handleCloseImageEditor}
        onImageEdited={handleImageEdited}
      />
    </div>
  );
};

export default CreateMedia;
