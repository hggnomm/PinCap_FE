"use client";

import React, { useEffect, useState } from "react";

import { Form, Input } from "antd";

import CollaboratorsSection from "@/components/collaborators/CollaboratorsSection";
import CheckboxWithDescription from "@/components/form/checkbox/CheckBoxComponent";
import FieldItem from "@/components/form/fieldItem/FieldItem";
import Loading from "@/components/loading/Loading";
import MediaThumbnailSelector from "@/components/mediaThumbnailSelector/MediaThumbnailSelector";
import { CollaboratorsListModal } from "@/components/modal/album";
import ModalComponent from "@/components/modal/ModalComponent";
import { MEDIA_TYPES } from "@/constants/constants";
import { useFormValidation } from "@/hooks";
import { useAlbum } from "@/react-query/useAlbum";
import type { UpdateAlbumRequest } from "@/types/Album/AlbumRequest";
import { Album, Media } from "@/types/type";
import { getFirstImageUrl } from "@/utils/utils";
import { updateAlbumSchema } from "@/validation/album";

interface EditAlbumModalProps {
  visible: boolean;
  album: Album | null;
  onCancel: () => void;
  onConfirm: (albumRequest: UpdateAlbumRequest) => Promise<void>;
  onDeleteClick: () => void;
  onInviteCollaborators: () => void;
  loading?: boolean;
}

const EditAlbumModal: React.FC<EditAlbumModalProps> = ({
  visible,
  album,
  onCancel,
  onConfirm,
  onDeleteClick,
  onInviteCollaborators,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [privacy, setPrivacy] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>("");
  const [showThumbnailSelector, setShowThumbnailSelector] = useState(false);
  const [collaboratorsListModalVisible, setCollaboratorsListModalVisible] =
    useState(false);
  const { validate, validateField, getFieldError } =
    useFormValidation(updateAlbumSchema);
  const { getAlbumById } = useAlbum();

  // Fetch detail album using hook - only when modal is visible
  const { data: detailAlbum, isLoading: loadingDetail } = getAlbumById(
    album?.id || "",
    visible // Enable query only when modal is visible
  );

  // Initialize form when detail album is loaded
  useEffect(() => {
    if (visible && detailAlbum) {
      form.resetFields();
      setPrivacy(detailAlbum.privacy === "PRIVATE");
      setSelectedThumbnail(detailAlbum.image_cover || "");
      form.setFieldsValue({
        album_name: detailAlbum.album_name,
      });
    }
  }, [visible, detailAlbum, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedThumbnail("");
      form.resetFields();
    }
  }, [visible, form]);

  const handleConfirm = async () => {
    if (loading) return; // Prevent multiple submissions

    try {
      const formValues = await form.validateFields();

      // Process image_cover: if it's a JSON array (from FLEXIBLE), get first image URL
      let imageCover = selectedThumbnail || undefined;
      if (selectedThumbnail) {
        const firstImageUrl = getFirstImageUrl(selectedThumbnail);
        imageCover = firstImageUrl || undefined;
      }

      const albumRequest = {
        album_name: formValues.album_name,
        privacy: (privacy && "0") || "1",
        image_cover: imageCover,
      };

      // Validate with Zod before submitting
      if (!validate(albumRequest)) {
        return;
      }

      await onConfirm(albumRequest);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePrivacyChange = (checked: boolean) => {
    setPrivacy(checked);
  };

  const handleThumbnailSelect = (mediaUrl: string | null) => {
    setSelectedThumbnail(mediaUrl || "");
    setShowThumbnailSelector(false);
  };

  // Get current thumbnail image for display
  const getCurrentThumbnail = () => {
    if (selectedThumbnail) {
      // If selectedThumbnail is a JSON array (from FLEXIBLE media), parse it to get first image
      // If it's a regular URL (from IMAGE media), return as is
      return getFirstImageUrl(selectedThumbnail);
    }
    if (detailAlbum?.medias && detailAlbum.medias.length > 0) {
      // Tìm ảnh đầu tiên từ IMAGE type
      const firstImage = detailAlbum.medias.find(
        (media: Media) => media.type === MEDIA_TYPES.IMAGE
      );
      if (firstImage?.media_url) {
        return firstImage.media_url;
      }

      // Nếu không có IMAGE, tìm FLEXIBLE type và lấy ảnh đầu tiên
      const firstFlexible = detailAlbum.medias.find(
        (media: Media) => media.type === MEDIA_TYPES.FLEXIBLE
      );
      if (firstFlexible?.media_url) {
        return getFirstImageUrl(firstFlexible.media_url);
      }
    }
    return null;
  };

  return (
    <ModalComponent
      title="Edit Your Album"
      visible={visible}
      onCancel={onCancel}
      onConfirm={handleConfirm}
      buttonLabels={{ confirmLabel: "Update", cancelLabel: "Cancel" }}
      className="!w-[700px]"
    >
      <Loading isLoading={loadingDetail && visible}>
        <div className="create-album">
          <Form form={form} layout="vertical">
            <FieldItem
              label="Name"
              name="album_name"
              validateStatus={(getFieldError("album_name") && "error") || ""}
              help={getFieldError("album_name")}
              rules={[
                { required: true, message: "Please input the album title!" },
              ]}
              placeholder="Like 'Places to Go' or 'Recipes to Make'"
            >
              <Input
                onChange={(e) => validateField("album_name", e.target.value)}
                onBlur={(e) => validateField("album_name", e.target.value)}
              />
            </FieldItem>

            <CheckboxWithDescription
              title="Keep this album private"
              description="So only you and collaborator can see it."
              value={privacy}
              onChange={(e) => handlePrivacyChange(e.target.checked)}
              name="privacy"
            />

            {/* Thumbnail Section */}
            <div className="mb-6">
              <h4 className="text-[1.1em] font-semibold text-gray-900 tracking-tight">
                Album Thumbnail
              </h4>

              <div className="flex items-center space-x-4 mt-2">
                {/* Current thumbnail preview */}
                <div className="w-24 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-gray-400 transition-colors">
                  {getCurrentThumbnail() && (
                    <div className="relative w-full h-full group">
                      <img
                        src={getCurrentThumbnail()! || "/placeholder.svg"}
                        alt="Album thumbnail"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  {!getCurrentThumbnail() && (
                    <div className="text-center text-gray-400">
                      <div className="w-8 h-8 mx-auto mb-1">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="w-full h-full"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      </div>
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </div>

                {/* Select button and info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      onClick={() => setShowThumbnailSelector(true)}
                      disabled={
                        loadingDetail ||
                        !detailAlbum?.medias ||
                        detailAlbum.medias.filter(
                          (m: Media) =>
                            m.type === MEDIA_TYPES.IMAGE ||
                            m.type === MEDIA_TYPES.FLEXIBLE
                        ).length === 0
                      }
                      className="!m-0 !px-4 !py-2 !border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loadingDetail && (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </div>
                      )}
                      {!loadingDetail &&
                        detailAlbum?.medias &&
                        detailAlbum.medias.filter(
                          (m: Media) =>
                            m.type === MEDIA_TYPES.IMAGE ||
                            m.type === MEDIA_TYPES.FLEXIBLE
                        ).length > 0 &&
                        "Change thumbnail"}
                      {!loadingDetail &&
                        (!detailAlbum?.medias ||
                          detailAlbum.medias.filter(
                            (m: Media) =>
                              m.type === MEDIA_TYPES.IMAGE ||
                              m.type === MEDIA_TYPES.FLEXIBLE
                          ).length === 0) &&
                        "No images available"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>

          <CollaboratorsSection
            collaborators={detailAlbum?.allUser ?? []}
            onAddCollaborator={onInviteCollaborators}
            onViewAllCollaborators={() =>
              setCollaboratorsListModalVisible(true)
            }
            className="mt-6"
            titleClassName="text-[1.1em]"
          />

          <div
            className="delete-action cursor-pointer p-1 text-left hover:scale-[0.99] hover:bg-gray-100 transition-transform"
            onClick={onDeleteClick}
          >
            <p className="font-medium text-xl text-gray-900">Delete album</p>
            <p className="text-gray-500 font-medium">
              You have 7 days to restore a deleted Album. After that, it will be
              permanently deleted.
            </p>
          </div>
        </div>
      </Loading>

      {/* Media Thumbnail Selector Modal */}
      <MediaThumbnailSelector
        visible={showThumbnailSelector}
        medias={detailAlbum?.medias || []}
        selectedMediaUrl={selectedThumbnail}
        onCancel={() => setShowThumbnailSelector(false)}
        onConfirm={handleThumbnailSelect}
        title="Choose Album Thumbnail"
      />

      <CollaboratorsListModal
        visible={collaboratorsListModalVisible}
        onCancel={() => setCollaboratorsListModalVisible(false)}
        albumId={album?.id || ""}
      />
    </ModalComponent>
  );
};

export default EditAlbumModal;
