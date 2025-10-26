import { useState, useEffect, useCallback } from "react";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getDetailMedia } from "@/api/media";
import { checkImageSafety, checkMultipleImagesSafety } from "@/api/vision";
import { ENV } from "@/constants/env";
import { useMediaToast } from "@/contexts/MediaToastContext";
import { useMedia } from "@/react-query/useMedia";
import { TokenPayload } from "@/types/Auth";
import { Media } from "@/types/type";
import { getTagName } from "@/utils/tagMapping";
import { CreateMediaFormData, UpdateMediaFormData } from "@/validation/media";

export const useCreateMedia = (resetFormFields?: () => void) => {
  const tokenPayload = useSelector(
    (state: { auth: TokenPayload }) => state.auth
  );
  const { createMedia, updateMedia, getMyMedia } = useMedia();
  const { showToast } = useMediaToast();

  // States
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
  const [draftId, setDraftId] = useState<string>("");

  const {
    data: drafts = [],
    isLoading: loadingDrafts,
    refetch: refetchDrafts,
  } = getMyMedia(1, false, drawerVisible);

  const handleSelectMedia = useCallback((media: Media) => {
    setImageUrl(media.media_url);
    setIsSelectedDraft(true);
    setFileList([]);
    setTags(media.tags?.map(getTagName) || []);
  }, []);

  const handleFormChange = (formValue: CreateMediaFormData) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      handleCreateOrUpdateMedia(formValue, false);
    }, 5000);

    setDebounceTimeout(newTimeout);
  };

  const handleCreateOrUpdateMedia = async (
    formValue: CreateMediaFormData,
    isCreated: boolean
  ) => {
    const mediaData: CreateMediaFormData = {
      ...formValue,
      mediaOwner_id: tokenPayload.id,
      media: fileList,
      tags_name: tags,
      is_created: isCreated,
      is_comment: 1, // Backend expects 1/0 instead of true/false
    };

    if (isCreated) {
      setIsLoad(true);
    } else {
      setIsLoadCreateDraft(true);
      setTextCreateDraft(true);
    }

    try {
      let response;
      if (formValue.id) {
        const { media: _media, ...updateData } = mediaData;
        response = await updateMedia({
          id: formValue.id,
          data: updateData as UpdateMediaFormData,
        });
      } else {
        response = await createMedia(mediaData);
      }

      if (response?.media?.id) {
        setDraftId(response.media.id);
        if (isCreated && response?.media) {
          showToast(response.media, formValue.id ? "update" : "create");
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
      if (isCreated) {
        setIsLoad(false);
        setDraftId("");
        refetchDrafts();
        resetForm();
        // Reset form fields after successful publish
        if (resetFormFields) {
          resetFormFields();
        }
      } else {
        setTextCreateDraft(false);
      }
    }
  };

  const checkImagesBeforePublish = async (files: File[]): Promise<boolean> => {
    try {
      if (!ENV.IS_OPEN_SAFE_CHECK_MEDIA) {
        return true;
      }

      if (files.length === 0) return true;

      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length === 0) return true;

      let results: string[];
      if (imageFiles.length === 1) {
        const result = await checkImageSafety(imageFiles[0]);
        results = [result];
      } else {
        results = await checkMultipleImagesSafety(imageFiles);
      }

      // Log results for debugging
      results.forEach((result, index) => {
        console.log(`Image ${index + 1} safety result:`, result);
      });

      // For now, always allow upload (you can add logic here to block unsafe images)
      return true;
    } catch (error) {
      console.error("Error checking image safety:", error);
      // On error, allow upload (fail-safe approach)
      return true;
    }
  };

  const handleGenerateClick = async (formValue: CreateMediaFormData) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      setDebounceTimeout(null);
    }

    if (!fileList.length && !formValue.id)
      return toast.error("Please upload an image or media file.");

    const isSafe = await checkImagesBeforePublish(fileList);

    if (!isSafe) {
      toast.warning(
        "Some images contain inappropriate content and cannot be published."
      );
    }

    await handleCreateOrUpdateMedia(formValue, true);
  };

  // Reset form
  const resetForm = () => {
    setFileList([]);
    setTags([]);
    setImageUrl("");
    setDrawerVisible(false);
    setIsLoadCreateDraft(false);
    setIsFormDisabled(true);
    setIsSelectedDraft(false);
    setDraftId("");
  };

  // Effects
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
  }, [draftId, drafts, handleSelectMedia]);

  useEffect(() => {
    if (fileList.length > 0) {
      setIsFormDisabled(false);
    } else if (isSelectedDraft) {
      setIsFormDisabled(false);
    } else {
      setIsFormDisabled(true);
    }
  }, [fileList, isSelectedDraft]);

  return {
    // States
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

    // Drafts
    drafts,
    loadingDrafts,
    refetchDrafts,

    // Handlers
    handleSelectMedia,
    handleFormChange,
    handleGenerateClick,
    resetForm,
  };
};
