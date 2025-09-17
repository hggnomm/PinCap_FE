import React, { useState } from "react";
import { getDetailMedia } from "@/api/media";
import { Divider } from "antd/es";
import { Media } from "type";
import ButtonCircle from "@/components/buttonCircle/ButtonCircle";
import { EllipsisOutlined } from "@ant-design/icons/lib";
import ModalComponent from "@/components/modal/ModalComponent";
import { toast } from "react-toastify";

interface DraftMediaProps {
  resetFormAndCloseDrawer: () => void;
  onSelectMedia: (media: Media) => void;
  drafts: Media[];
  loadingDrafts: boolean;
}

const DraftMedia = ({
  resetFormAndCloseDrawer,
  onSelectMedia,
  drafts,
  loadingDrafts,
}: DraftMediaProps) => {
  const [isSelectedMedia, setIsSelectedMedia] = useState<Media | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailMedia, setDetailMedia] = useState<Media | null>(null);

  const handleMediaClick = async (media: Media) => {
    if (isSelectedMedia?.id !== media.id) {
      setIsSelectedMedia(media);
    }
    const fetchedDetailMedia = await getDetailMedia(media.id);

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

  const deleteDraft = async () => {
    try {
      console.log("Deleting draft...");

      setDeleteModalVisible(false);
      toast.success("Draft deleted successfully!"); 
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error(
        "An error occurred while deleting the album. Please try again."
      );
    }
  };

  return (
    <div className="draft-container">
      {loadingDrafts ? (
        <div>Loading drafts...</div>
      ) : (
        <>
          <button
            className="create-media-btn"
            onClick={() => {
              setIsSelectedMedia(null);
              resetFormAndCloseDrawer();
            }}
          >
            <span className="text-container">Create new</span>
          </button>
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
                <div className="media-thumbnail">
                  <img
                    src={media.media_url || "default-image-url"}
                    alt={media.media_name || "Media Item"}
                    className="thumbnail-image"
                  />
                </div>
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

          <ModalComponent
            titleDefault="Delete this draft?"
            visible={deleteModalVisible}
            onCancel={() => setDeleteModalVisible(false)}
            onConfirm={deleteDraft}
            buttonLabels={{
              confirmLabel: "Delete",
              cancelLabel: "Cancel",
            }}
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
        </>
      )}
    </div>
  );
};

export default DraftMedia;
