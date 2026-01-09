import { useState, Suspense, lazy } from "react";

import { toast } from "react-toastify";

import { EllipsisOutlined } from "@ant-design/icons/lib";

import { Divider } from "antd/es";

import { getDetailMedia } from "@/api/media";
import ButtonCircle from "@/components/ButtonCircle/ButtonCircle";
import Loading from "@/components/Loading/Loading";
import { MEDIA_TYPES } from "@/constants/constants";
import { useMedia } from "@/react-query/useMedia";
import { Media } from "@/types/type";
import { getMediaPreviewUrl, isMediaVideo } from "@/utils/utils";

const ModalComponent = lazy(() => import("@/components/Modal/ModalComponent"));

interface DraftMediaProps {
  resetFormAndCloseDrawer: () => void;
  onSelectMedia: (media: Media) => void;
  drafts: Media[];
  loadingDrafts: boolean;
  onDraftDeleted?: () => void;
}

const DraftMedia = ({
  resetFormAndCloseDrawer,
  onSelectMedia,
  drafts,
  loadingDrafts,
  onDraftDeleted,
}: DraftMediaProps) => {
  const { deleteMedia, deleteMediaLoading } = useMedia();
  const [isSelectedMedia, setIsSelectedMedia] = useState<Media | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailMedia, setDetailMedia] = useState<Media | null>(null);

  const handleMediaClick = async (media: Media) => {
    if (isSelectedMedia?.id !== media.id) {
      setIsSelectedMedia(media);
    }
    const fetchedDetailMedia = await getDetailMedia(media.id, true);

    if (fetchedDetailMedia) {
      setDetailMedia(fetchedDetailMedia);
      onSelectMedia(fetchedDetailMedia);
    }
  };

  const handleDeleteClick = (media: Media) => {
    setDetailMedia(media);
    onSelectMedia(media);
    setDeleteModalVisible(true);
  };

  const getMediaElement = (media: Media) => {
    // Handle null type as FLEXIBLE media
    const mediaType = media.type || MEDIA_TYPES.FLEXIBLE;
    const mediaUrl = getMediaPreviewUrl(media.media_url, mediaType);
    const isVideo = isMediaVideo(media.media_url, mediaType);

    if (isVideo) {
      return (
        <video className="thumbnail-image" muted playsInline preload="metadata">
          <source src={mediaUrl || ""} type="video/mp4" />
        </video>
      );
    }

    return (
      <img
        src={mediaUrl || ""}
        alt={media.media_name}
        className="thumbnail-image"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.jpg";
        }}
      />
    );
  };

  const deleteDraft = async () => {
    if (!detailMedia?.id) {
      toast.error("No draft selected to delete");
      return;
    }

    try {
      await deleteMedia([detailMedia.id]);
      setDeleteModalVisible(false);
      toast.success("Draft deleted successfully!");

      // Reset selected media if it was the deleted one
      if (isSelectedMedia?.id === detailMedia.id) {
        setIsSelectedMedia(null);
        resetFormAndCloseDrawer();
      }

      // Callback to refresh drafts list
      if (onDraftDeleted) {
        onDraftDeleted();
      }
    } catch (error: unknown) {
      console.error("Error deleting draft:", error);
      const errorMessage =
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 403
          ? "You don't have permission to delete this draft."
          : error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "An error occurred while deleting the draft. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="draft-container">
      <Loading isLoading={loadingDrafts}>
        {drafts.length > 0 && (
          <button
            className="create-media-btn"
            onClick={() => {
              setIsSelectedMedia(null);
              resetFormAndCloseDrawer();
            }}
          >
            <span className="text-container">Create new</span>
          </button>
        )}
        <Divider />
        <div className="media-list">
          {drafts.map((media) => (
            <div
              key={media.id}
              className={`media-item ${
                isSelectedMedia?.id === media.id ? "selected" : ""
              }`}
              onClick={() => handleMediaClick(media)}
            >
              <div className="media-thumbnail">{getMediaElement(media)}</div>
              <div className="media-name">{media.media_name}</div>
              <div className="options">
                <ButtonCircle
                  text="Options"
                  paddingClass="padding-small"
                  icon={<EllipsisOutlined style={{ fontSize: "26px" }} />}
                  dropdownMenu={[
                    {
                      key: "1",
                      title: "Delete",
                      onClick: () => handleDeleteClick(media),
                    },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>

        <Suspense fallback={<></>}>
          <ModalComponent
            titleDefault="Delete this draft?"
            visible={deleteModalVisible}
            onCancel={() => setDeleteModalVisible(false)}
            onConfirm={deleteDraft}
            buttonLabels={{
              confirmLabel: deleteMediaLoading ? "Deleting..." : "Delete",
              cancelLabel: "Cancel",
            }}
            confirmLoading={deleteMediaLoading}
          >
            <div
              style={{
                marginBottom: 20,
                marginTop: 20,
              }}
            >
              Are you sure you want to delete this draft
              <p
                style={{
                  fontWeight: 500,
                  fontSize: "1.1em",
                  display: "inline",
                  marginRight: "5px",
                  marginLeft: "5px",
                }}
              >
                {detailMedia?.media_name}
              </p>
              This action cannot be undone.
            </div>
          </ModalComponent>
        </Suspense>
      </Loading>
    </div>
  );
};

export default DraftMedia;
