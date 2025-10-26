import React, { useEffect, useRef, useState } from "react";

import "./index.less";
import "./FilePond.less";
import { FilePond, registerPlugin } from "react-filepond";
import "react-toastify/dist/ReactToastify.css";

import { clsx } from "clsx";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css";
import { FilePondFile } from "filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginMediaPreview from "filepond-plugin-media-preview";

import Title from "antd/es/typography/Title";

import { Button, Col, Form, Input, Row, Select, Spin, Drawer, Tag } from "antd";

import ImageEditor from "@/components/imageEditor";
import MediaViewer from "@/components/mediaViewer/MediaViewer";
import { PRIVACY } from "@/constants/constants";
import { useCreateMedia } from "@/hooks";
import { Media } from "@/types/type";
import { getTagName } from "@/utils/tagMapping";

import DraftMedia from "./DraftMedia";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginFileValidateSize,
  FilePondPluginImageEdit,
  FilePondPluginMediaPreview
);

const CreateMedia: React.FC = () => {
  const [form] = Form.useForm();

  // Image Editor states
  const [isImageEditorVisible, setIsImageEditorVisible] =
    useState<boolean>(false);
  const [editingImageSrc, setEditingImageSrc] = useState<string>("");
  const [editingImageIndex, setEditingImageIndex] = useState<number>(-1);

  // Ref for FilePond container
  const filepondRef = useRef<HTMLDivElement>(null);

  const isUserTagActionRef = useRef<boolean>(false);

  const {
    isLoad,
    fileList,
    setFileList,
    drawerVisible,
    setDrawerVisible,
    tags,
    setTags,
    isSelectedDraft,
    setIsSelectedDraft,
    isFormDisabled,
    isLoadCreateDraft,
    textCreateDraft,
    imageUrl,
    setImageUrl,
    draftId,
    drafts,
    loadingDrafts,
    refetchDrafts,
    handleSelectMedia,
    handleFormChange,
    handleGenerateClick,
    resetForm,
  } = useCreateMedia(
    () => form.resetFields(),
    (values) => form.setFieldsValue(values)
  );

  const handleTagInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const input = e.currentTarget;
      const newTag = input.value.trim();

      if (newTag) {
        setTags((prevTags) => {
          if (prevTags.length >= 10) {
            return prevTags;
          }
          if (prevTags.includes(newTag)) {
            return prevTags;
          }
          isUserTagActionRef.current = true;
          return [...prevTags, newTag];
        });
      }

      input.value = "";
      form.setFieldValue("tags_name", "");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    isUserTagActionRef.current = true;
    setTags((prevTags) => prevTags.filter((t) => t !== tagToRemove));
  };

  const handleSelectMediaWithForm = (media: Media) => {
    form.setFieldsValue({
      media_name: media.media_name,
      description: media.description,
      privacy: media.privacy === "1" ? PRIVACY.PUBLIC : PRIVACY.PRIVATE,
      tags_name: media.tags?.map(getTagName) || [],
      id: media.id,
    });
    handleSelectMedia(media);
  };

  const handleFormChangeWithDebounce = () => {
    const formValue = form.getFieldsValue(true);
    handleFormChange(formValue);
  };

  const handlePublish = async () => {
    const formValue = form.getFieldsValue(true);
    await handleGenerateClick(formValue);
  };

  const handleOpenImageEditor = (index: number = 0) => {
    let imageSrc = "";

    if (imageUrl && index === 0) {
      imageSrc = imageUrl;
    } else if (fileList.length > index) {
      imageSrc = URL.createObjectURL(fileList[index]);
    }

    if (imageSrc) {
      setEditingImageSrc(imageSrc);
      setEditingImageIndex(index);
      setIsImageEditorVisible(true);
    }
  };

  const handleImageEdited = (editedBlob: Blob) => {
    const editedFile = new File([editedBlob], "edited-image.jpg", {
      type: "image/jpeg",
    });

    if (editingImageIndex === 0 && imageUrl) {
      setFileList([editedFile]);
      setImageUrl("");
      setIsSelectedDraft(false);
    } else {
      const newFileList = [...fileList];
      newFileList[editingImageIndex] = editedFile;
      setFileList(newFileList);
    }

    setIsImageEditorVisible(false);
    setEditingImageSrc("");
    setEditingImageIndex(-1);
  };

  const handleCloseImageEditor = () => {
    setIsImageEditorVisible(false);
    setEditingImageSrc("");
    setEditingImageIndex(-1);
  };

  const handleResetForm = () => {
    form.resetFields();
    resetForm();
  };

  useEffect(() => {
    const loadMediaPreview = async () => {
      try {
        const FilePondPluginMediaPreview = await import(
          "filepond-plugin-media-preview"
        );
        registerPlugin(FilePondPluginMediaPreview.default);
        console.log("Media preview plugin loaded successfully");
      } catch (error) {
        console.warn("Could not load media preview plugin:", error);
      }
    };
    loadMediaPreview();
  }, []);

  useEffect(() => {
    if (!form.getFieldValue("privacy")) {
      form.setFieldsValue({ privacy: PRIVACY.PRIVATE });
    }
  }, [form]);

  useEffect(() => {
    if (isUserTagActionRef.current) {
      isUserTagActionRef.current = false;
      handleFormChangeWithDebounce();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

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

    if (!filepondRef.current) return;

    // Initial add with multiple retries to handle FilePond rendering delays
    const timers: NodeJS.Timeout[] = [];
    [100, 300, 500].forEach((delay) => {
      timers.push(setTimeout(addEditButtons, delay));
    });

    // Set up MutationObserver to watch for DOM changes in FilePond
    const observer = new MutationObserver(() => {
      addEditButtons();
    });

    observer.observe(filepondRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <Button onClick={handlePublish} className="btn-publish-media">
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
          disabled={isFormDisabled}
          className={clsx("form-create-media", {
            "set-opacity": isLoad,
            "!flex-col": fileList.length >= 2,
          })}
          onValuesChange={handleFormChangeWithDebounce}
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
                {(() => {
                  const isFlexibleMedia = (() => {
                    try {
                      const parsed = JSON.parse(imageUrl);
                      return Array.isArray(parsed) && parsed.length > 1;
                    } catch {
                      return false;
                    }
                  })();

                  if (isFlexibleMedia) {
                    const mockMedia = {
                      id: draftId,
                      media_url: imageUrl,
                      type: null,
                    } as Media;

                    return (
                      <MediaViewer
                        media={mockMedia}
                        className="!min-h-0 !w-auto [&_.media-viewer]:!min-h-0 [&_.media-viewer]:!w-auto [&_.media-viewer-container]:!min-h-0 [&_.media-viewer-container]:!w-auto [&_.media-element]:!max-h-[65vh] [&_.media-element]:!w-auto"
                      />
                    );
                  } else {
                    return (
                      <img
                        className="transition-all duration-300"
                        src={imageUrl}
                        alt="media preview"
                      />
                    );
                  }
                })()}
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
                      setFileList(
                        fileItems.map((item: FilePondFile) => item.file as File)
                      );
                    }}
                    allowMultiple={true}
                    maxFiles={6}
                    maxFileSize={(20 * 1024 * 1024).toString()}
                    acceptedFileTypes={["image/*", "video/*"]}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    imagePreviewMarkupShow
                    itemInsertLocation="after"
                    allowRevert={false}
                    allowRemove={true}
                    allowReplace={true}
                    instantUpload={false}
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
                    onClose={() => handleRemoveTag(tag)}
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
      >
        <DraftMedia
          resetFormAndCloseDrawer={handleResetForm}
          onSelectMedia={handleSelectMediaWithForm}
          drafts={drafts}
          loadingDrafts={loadingDrafts}
          onDraftDeleted={refetchDrafts}
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
