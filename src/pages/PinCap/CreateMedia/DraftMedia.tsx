import React, { useEffect, useRef, useState } from "react";
import { getDetailMedia, getMyMedias } from "../../../api/media";
import Loading from "../../../components/loading/Loading";
import { Divider } from "antd/es";
import { Media } from "type";

interface DraftMediaProps {
  resetFormAndCloseDrawer: () => void;
  onSelectMedia: (media: Media) => void;
  reloadDrafts: boolean;
  setReloadDrafts: (reload: boolean) => void;
}

const DraftMedia = ({
  resetFormAndCloseDrawer,
  onSelectMedia,
  drafts,
  loadingDrafts,
}: DraftMediaProps & { drafts: Media[]; loadingDrafts: boolean }) => {
  const [isSelectedMedia, setIsSelectedMedia] = useState<Media | null>(null);

  const handleMediaClick = async (media: Media) => {
    setIsSelectedMedia(media);
    const detailMedia = await getDetailMedia(media.id);

    if (detailMedia) {
      onSelectMedia(detailMedia);
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DraftMedia;
