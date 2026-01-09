import React, { useEffect, useState, useMemo } from "react";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { clsx } from "clsx";

import { CheckboxChangeEvent } from "antd/es/checkbox";

import { Form, Input } from "antd";

import CheckboxWithDescription from "@/components/Form/checkbox/CheckBoxComponent";
import FieldItem from "@/components/Form/fieldItem/FieldItem";
import Loading from "@/components/Loading/Loading";
import MediaViewer from "@/components/MediaViewer/MediaViewer";
import ModalComponent from "@/components/Modal/ModalComponent";
import { ALBUM_ROLES, PRIVACY } from "@/constants/constants";
import { useMediaToast } from "@/contexts/MediaToastContext";
import { useAlbum } from "@/react-query/useAlbum";
import { useMedia } from "@/react-query/useMedia";
import { TokenPayload } from "@/types/Auth";
import { AlbumUser, Media } from "@/types/type";
import { UpdateMediaFormData } from "@/validation/media";

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
  const { removeMediasFromAlbum, getAlbumById } = useAlbum();
  const { showToast } = useMediaToast();

  const tokenPayload = useSelector(
    (state: { auth: TokenPayload }) => state.auth
  );
  const ownerId = media?.ownerUser?.id ?? media?.media_owner_id;
  const isOwner = ownerId === tokenPayload.id;

  // Fetch album data when in album context
  const { data: albumData } = getAlbumById(
    albumId || "",
    inAlbumContext && !!albumId && visible
  );

  // Check if user has editor permission or higher (EDIT or OWNER)
  const hasEditorPermission = useMemo(() => {
    if (!inAlbumContext || !albumData?.allUser || !tokenPayload?.id) {
      return false;
    }
    const currentUser = albumData.allUser.find(
      (user: AlbumUser) => user.id === tokenPayload.id
    );
    return (
      currentUser?.album_role === ALBUM_ROLES.EDIT ||
      currentUser?.album_role === ALBUM_ROLES.OWNER
    );
  }, [inAlbumContext, albumData?.allUser, tokenPayload?.id]);

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
      const updatedData: UpdateMediaFormData = {
        id: media.id,
        media_name: formValue.media_name,
        description: formValue.description,
        privacy: privacy ? PRIVACY.PRIVATE : PRIVACY.PUBLIC,
        is_comment: isComment ? 1 : 0,
      };

      const response = await updateMedia({ id: media.id, data: updatedData });
      onCancel();

      if (response?.media) {
        showToast(response.media, "update");
      }

      onSuccess?.();
    } catch (error: unknown) {
      if (error instanceof Error && "errorFields" in error) {
        toast.error("Please fill in all required fields!");
      } else {
        console.error("Update error:", error);
        toast.error("Failed to update media. Please try again.");
      }
    }
  };

  const handlePrivacyChange = (e: CheckboxChangeEvent) => {
    setPrivacy(e.target.checked);
  };

  const handleCommentChange = (e: CheckboxChangeEvent) => {
    setIsComment(e.target.checked);
  };

  return (
    <ModalComponent
      title={inAlbumContext ? "Edit Media In Album" : "Edit Your Media"}
      visible={visible}
      onCancel={onCancel}
      onConfirm={isOwner ? handleConfirm : undefined}
      buttonLabels={{
        confirmLabel: isOwner ? "Save" : undefined,
        cancelLabel: "Cancel",
      }}
      hideConfirmButton={!isOwner}
      className="!max-w-[1200px]"
      bodyClassName="!max-h-[75vh] !overflow-hidden"
    >
      <Loading isLoading={visible && !media}>
        <div className="flex flex-col md:flex-row items-start gap-6 h-full">
          <div className="flex-shrink-0 w-full md:max-w-[400px] max-h-[70vh] overflow-y-auto custom-scroll-bar pr-2">
            <Form form={form} layout="vertical">
              {media?.added_by_user && (
                <div className="flex flex-col mb-4">
                  <p className="flex items-start text-[1.1em] text-[#0c0c0c] mb-2 font-medium">
                    Added by
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={media.added_by_user.avatar}
                      alt={media.added_by_user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-gray-900 font-medium truncate">
                        {media.added_by_user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {media.added_by_user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <FieldItem
                label="Title"
                name="media_name"
                placeholder="Add a title"
              >
                <Input disabled={!isOwner} />
              </FieldItem>

              <FieldItem
                label="Description"
                name="description"
                placeholder="Tell everyone what your Media is about"
              >
                <Input.TextArea rows={4} disabled={!isOwner} />
              </FieldItem>

              <div className={!isOwner ? "opacity-50 pointer-events-none" : ""}>
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
              </div>
            </Form>

            <div
              className={clsx(
                "p-2 text-left transition-transform mt-6 rounded-lg",
                isOwner
                  ? "cursor-pointer hover:scale-[0.99] hover:bg-gray-100"
                  : "opacity-50 pointer-events-none cursor-not-allowed"
              )}
              onClick={isOwner ? onDeleteClick : undefined}
            >
              <p className="font-medium text-lg text-gray-900">Delete media</p>
              <p className="text-sm text-gray-500 font-medium">
                Delete this media permanently. This action cannot be undone.
              </p>
            </div>

            {inAlbumContext && albumId && media && (
              <div
                className={clsx(
                  "p-2 text-left transition-transform mt-3 rounded-lg",
                  hasEditorPermission
                    ? "cursor-pointer hover:scale-[0.99] hover:bg-gray-100"
                    : "opacity-50 pointer-events-none cursor-not-allowed"
                )}
                onClick={
                  hasEditorPermission
                    ? async () => {
                        try {
                          await removeMediasFromAlbum({
                            album_id: albumId,
                            medias_id: [media.id],
                          });
                          toast.success("Removed media from album");
                          onRemovedFromAlbum?.();
                          onCancel();
                        } catch (error: unknown) {
                          console.error(
                            "Error removing media from album:",
                            error
                          );
                          let errorMessage =
                            "Failed to remove media from album";

                          // Check if error has message property (from apiClient interceptor)
                          if (
                            error &&
                            typeof error === "object" &&
                            "message" in error
                          ) {
                            errorMessage = String(error.message);
                          }
                          // Fallback: check axios error response structure
                          else if (
                            error &&
                            typeof error === "object" &&
                            "response" in error &&
                            error.response &&
                            typeof error.response === "object" &&
                            "data" in error.response &&
                            error.response.data &&
                            typeof error.response.data === "object"
                          ) {
                            if ("message" in error.response.data) {
                              errorMessage = String(
                                error.response.data.message
                              );
                            } else if ("error" in error.response.data) {
                              errorMessage = String(error.response.data.error);
                            }
                          }

                          toast.error(errorMessage);
                        }
                      }
                    : undefined
                }
              >
                <p className="font-medium text-lg text-gray-900">
                  Remove from this album
                </p>
                <p className="text-sm text-gray-500 font-medium">
                  This only removes the media from the album, it will not be
                  deleted.
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
