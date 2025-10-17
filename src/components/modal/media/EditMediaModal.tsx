import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { toast } from "react-toastify";
import ModalComponent from "@/components/modal/ModalComponent";
import FieldItem from "@/components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "@/components/form/checkbox/CheckBoxComponent";
import { Media } from "@/types/type";
import { useMedia } from "@/hooks/useMedia";
import { PRIVACY } from "@/constants/constants";
import MediaViewer from "@/components/mediaViewer/MediaViewer";
import Loading from "@/components/loading/Loading";
import { useAlbum } from "@/hooks/useAlbum";

interface EditMediaModalProps {
  visible: boolean;
  media: Media | null;
  onCancel: () => void;
  onDeleteClick: () => void;
  onSuccess?: () => void;
  inAlbumContext?: boolean;
  albumId?: string;
  onRemovedFromAlbum?: () => void;
}

const EditMediaModal: React.FC<EditMediaModalProps> = ({
  visible,
  media,
  onCancel,
  onDeleteClick,
  onSuccess,
  inAlbumContext = false,
  albumId,
  onRemovedFromAlbum,
}) => {
  const [form] = Form.useForm();
  const [privacy, setPrivacy] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const { updateMedia } = useMedia();
  const { removeMediasFromAlbum } = useAlbum();

  // Initialize form when modal opens with media data
  useEffect(() => {
    if (visible && media) {
      form.setFieldsValue({
        media_name: media.media_name,
        description: media.description,
      });
      setPrivacy(media.privacy === "PRIVATE");
      setIsComment(media.is_comment);
    }
  }, [visible, media, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setPrivacy(false);
      setIsComment(false);
    }
  }, [visible, form]);

  const handleConfirm = async () => {
    if (!media) return;

    try {
      const formValue = await form.validateFields();
      const updatedData = {
        media_name: formValue.media_name,
        description: formValue.description,
        privacy: privacy ? PRIVACY.PRIVATE : PRIVACY.PUBLIC,
        is_comment: isComment,
      };

      await updateMedia({ id: media.id, data: updatedData });
      onCancel();
      toast.success("Media updated successfully!");
      onSuccess?.();
    } catch (error: any) {
      if (error.errorFields) {
        toast.error("Please fill in all required fields!");
      } else {
        console.error("Update error:", error);
        toast.error("Failed to update media. Please try again.");
      }
    }
  };

  const handlePrivacyChange = (e: any) => {
    setPrivacy(e.target.checked);
  };

  const handleCommentChange = (e: any) => {
    setIsComment(e.target.checked);
  };

  return (
    <ModalComponent
      title={inAlbumContext ? "Edit Media In Album" : "Edit Your Media"}
      visible={visible}
      onCancel={onCancel}
      onConfirm={handleConfirm}
      buttonLabels={{ confirmLabel: "Save", cancelLabel: "Cancel" }}
      className="!max-w-[1200px]"
      bodyClassName="!max-h-[75vh] !overflow-hidden"
    >
      <Loading isLoading={visible && !media}>
        <div className="flex flex-col lg:flex-row items-start gap-6 h-full">
          <div className="flex-shrink-0 w-full lg:max-w-[400px] max-h-[70vh] overflow-y-auto pr-2">
            <Form form={form} layout="vertical">
              <FieldItem
                label="Title"
                name="media_name"
                rules={[
                  { required: true, message: "Please input the media title!" },
                ]}
                placeholder="Add a title"
              >
                <Input />
              </FieldItem>

              <FieldItem
                label="Description"
                name="description"
                placeholder="Tell everyone what your Media is about"
              >
                <Input.TextArea rows={4} />
              </FieldItem>

              <CheckboxWithDescription
                title="Keep this media private"
                description="So only you can see it."
                value={privacy}
                onChange={handlePrivacyChange}
                name="privacy"
              />

              <CheckboxWithDescription
                title="Allow comments"
                description="Let people comment on your media."
                value={isComment}
                onChange={handleCommentChange}
                name="is_comment"
              />
            </Form>

            <div
              className="cursor-pointer p-2 text-left hover:scale-[0.99] hover:bg-gray-100 transition-transform mt-6 rounded-lg"
              onClick={onDeleteClick}
            >
              <p className="font-medium text-lg text-gray-900">Delete media</p>
              <p className="text-sm text-gray-500 font-medium">
                Delete this media permanently. This action cannot be undone.
              </p>
            </div>

            {inAlbumContext && albumId && media && (
              <div
                className="cursor-pointer p-2 text-left hover:scale-[0.99] hover:bg-gray-100 transition-transform mt-3 rounded-lg"
                onClick={async () => {
                  try {
                    await removeMediasFromAlbum({ album_id: albumId, medias_id: [media.id] });
                    toast.success("Removed media from album");
                    onRemovedFromAlbum?.();
                    onCancel();
                  } catch (e) {
                    toast.error("Failed to remove media from album");
                  }
                }}
              >
                <p className="font-medium text-lg text-gray-900">Remove from this album</p>
                <p className="text-sm text-gray-500 font-medium">
                  This only removes the media from the album, it will not be deleted.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center min-h-0 !my-auto w-auto">
            <MediaViewer
              media={media}
              className="!min-h-0 !w-auto [&_.media-viewer]:!min-h-0 [&_.media-viewer]:!w-auto [&_.media-viewer-container]:!min-h-0 [&_.media-viewer-container]:!w-auto [&_.media-element]:!max-h-[65vh] [&_.media-element]:!w-auto"
            />
          </div>
        </div>
      </Loading>
    </ModalComponent>
  );
};

export default EditMediaModal;
