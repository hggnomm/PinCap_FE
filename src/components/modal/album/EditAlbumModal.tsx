"use client";

import React, { useEffect } from "react";
import { Form, Input } from "antd";
import ModalComponent from "@/components/modal/ModalComponent";
import FieldItem from "@/components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "@/components/form/checkbox/CheckBoxComponent";
import CollaboratorsSection from "@/components/collaborators/CollaboratorsSection";
import MediaThumbnailSelector from "@/components/mediaThumbnailSelector/MediaThumbnailSelector";
import Loading from "@/components/loading/Loading";
import type { Album } from "type";
import type { UpdateAlbumRequest } from "@/types/Album/AlbumRequest";
import { updateAlbumSchema, UpdateAlbumFormData } from "@/validation/album";
import { useFormValidation } from "@/hooks";
import { useAlbum } from "@/hooks/useAlbum";

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
  const [privacy, setPrivacy] = React.useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = React.useState<string>("");
  const [showThumbnailSelector, setShowThumbnailSelector] =
    React.useState(false);
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
      const albumRequest = {
        album_name: formValues.album_name,
        privacy: (privacy && "0") || "1",
        image_cover: selectedThumbnail || undefined,
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

  const handlePrivacyChange = (e: any) => {
    setPrivacy(e.target.checked);
  };

  const handleThumbnailSelect = (mediaUrl: string | null) => {
    setSelectedThumbnail(mediaUrl || "");
    setShowThumbnailSelector(false);
  };

  // Get current thumbnail image for display
  const getCurrentThumbnail = () => {
    if (selectedThumbnail) return selectedThumbnail;
    if (detailAlbum?.medias && detailAlbum.medias.length > 0) {
      const firstImage = detailAlbum.medias.find(
        (media: any) => media.type === "IMAGE"
      );
      return firstImage?.media_url;
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

          {/* Thumbnail Section */}
          <div className="mb-6">
            <h4 className="text-xl font-semibold text-gray-900 tracking-tight">
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
                      detailAlbum.medias.filter((m: any) => m.type === "IMAGE")
                        .length === 0
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
                      detailAlbum.medias.filter((m: any) => m.type === "IMAGE")
                        .length > 0 &&
                      "Change thumbnail"}
                    {!loadingDetail &&
                      (!detailAlbum?.medias ||
                        detailAlbum.medias.filter(
                          (m: any) => m.type === "IMAGE"
                        ).length === 0) &&
                      "No images available"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <CheckboxWithDescription
            title="Keep this album private"
            description="So only you and collaborator can see it."
            value={privacy}
            onChange={handlePrivacyChange}
            name="privacy"
          />
        </Form>

        {/* Collaborators Section */}
        <CollaboratorsSection
          collaborators={detailAlbum?.allUser ?? []}
          onAddCollaborator={onInviteCollaborators}
          className="mt-6"
          showLearnMore={false}
        />

        {/* Delete Album Section */}
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
    </ModalComponent>
  );
};

export default EditAlbumModal;
