import { useState, useEffect, useCallback } from "react";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useQueryClient } from "@tanstack/react-query";

import { notification } from "antd";

import { getDetailMedia, generateMetadata } from "@/api/media";
import { checkImageSafety, checkMultipleImagesSafety } from "@/api/vision";
import { PRIVACY } from "@/constants/constants";
import { ENV } from "@/constants/env";
import { useMediaToast } from "@/contexts/MediaToastContext";
import { useMedia } from "@/react-query/useMedia";
import { TokenPayload } from "@/types/Auth";
import { Media } from "@/types/type";
import { SafeSearchData } from "@/types/vision";
import { getTagName } from "@/utils/tagMapping";
import { checkImagePolicy } from "@/utils/visionUtils";
import { CreateMediaFormData, UpdateMediaFormData } from "@/validation/media";

// Delay in milliseconds before creating/updating draft
const DRAFT_SAVE_DELAY = 1000;

const mapPrivacyToFormValue = (privacy: string | undefined): "0" | "1" => {
  if (!privacy) return PRIVACY.PRIVATE;

  const privacyUpper = privacy.toUpperCase();
  if (privacyUpper === "PUBLIC" || privacy === "1") {
    return PRIVACY.PUBLIC;
  }
  if (privacyUpper === "PRIVATE" || privacy === "0") {
    return PRIVACY.PRIVATE;
  }

  // Default to PRIVATE if unknown value
  return PRIVACY.PRIVATE;
};

export const useCreateMedia = (
  resetFormFields?: () => void,
  updateFormFields?: (values: Partial<CreateMediaFormData>) => void
) => {
  const tokenPayload = useSelector(
    (state: { auth: TokenPayload }) => state.auth
  );
  const queryClient = useQueryClient();
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
  const [fetchedDraftId, setFetchedDraftId] = useState<string>("");
  const [isGeneratingMetadata, setIsGeneratingMetadata] =
    useState<boolean>(false);

  const {
    data: draftsResponse,
    isLoading: loadingDrafts,
    refetch: refetchDrafts,
  } = getMyMedia(1, false, drawerVisible);

  const drafts = draftsResponse?.data || [];

  const handleSelectMedia = useCallback(
    (media: Media, shouldUpdateForm = false) => {
      const url = Array.isArray(media.media_url)
        ? media.media_url[0]
        : media.media_url || "";
      setImageUrl(url);
      setIsSelectedDraft(true);
      setFileList([]);
      setTags(media.tags?.map(getTagName) || []);

      // Set draftId when selecting a draft
      if (media.id) {
        setDraftId(media.id);
      }

      if (shouldUpdateForm && updateFormFields) {
        updateFormFields({
          id: media.id,
          media_name: media.media_name,
          description: media.description,
          privacy: mapPrivacyToFormValue(media.privacy),
          tags_name: media.tags?.map(getTagName) || [],
        });
      }
    },
    [updateFormFields]
  );

  const handleFormChange = (formValue: CreateMediaFormData) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      handleCreateOrUpdateMedia(formValue, false);
    }, DRAFT_SAVE_DELAY);

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
        const newDraftId = response.media.id;
        setDraftId(newDraftId);

        if (!isCreated && !formValue.id && updateFormFields) {
          updateFormFields({ id: newDraftId });
        }

        // If updating an existing draft, refresh the current data
        if (!isCreated && formValue.id) {
          try {
            const refreshedDraft = await getDetailMedia(newDraftId, true);
            if (refreshedDraft) {
              handleSelectMedia(refreshedDraft, true);
            }
          } catch (error) {
            console.error("Error refreshing draft data:", error);
          }
        }

        if (isCreated && response?.media) {
          // Check image policy if safe_search_data exists
          if (response.media.safe_search_data) {
            const policyResult = checkImagePolicy(
              response.media.safe_search_data as SafeSearchData[]
            );

            if (policyResult.status === "VIOLATION") {
              notification.error({
                message: "Policy Violation",
                description: policyResult.message,
                duration: 5,
              });
            } else if (policyResult.status === "WARNING") {
              notification.warning({
                message: "Sensitive Content",
                description: policyResult.message,
                duration: 5,
              });
            }
            // SAFE status doesn't need a notification
          }

          showToast(response.media, formValue.id ? "update" : "create");

          // Invalidate MyMedia query to refetch updated data
          queryClient.invalidateQueries({
            queryKey: ["medias", "my-media", "created"],
          });
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

  const handleGenerateMetadata = async (
    field?: "title" | "description" | "all",
    mediaId?: string
  ) => {
    const idToUse = mediaId || draftId;

    if (!idToUse) {
      toast.error("No draft selected");
      return;
    }

    setIsGeneratingMetadata(true);
    try {
      const response = await generateMetadata(idToUse);

      if (response && response.message === "success") {
        const updates: Partial<CreateMediaFormData> = {};

        if (field === "title" || field === "all") {
          updates.media_name = response.title || "";
        }

        if (field === "description" || field === "all") {
          updates.description = response.description || "";
        }

        if (field === "all" && response.tags) {
          setTags(response.tags);
          updates.tags_name = response.tags;
        }

        if (updateFormFields) {
          updateFormFields(updates);
        }
      } else {
        toast.error("Failed to generate metadata");
      }
    } catch (error) {
      toast.error(
        `Error generating metadata: ${
          error instanceof Error
            ? error.message
            : "An unexpected error occurred."
        }`
      );
    } finally {
      setIsGeneratingMetadata(false);
    }
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
    setFetchedDraftId("");
  };

  // Effects
  useEffect(() => {
    const fetchDraftDetail = async () => {
      // Only fetch if draftId exists and hasn't been fetched yet
      if (draftId && draftId !== fetchedDraftId) {
        try {
          const detailDraft = await getDetailMedia(draftId, true);
          if (detailDraft) {
            // Update state
            const url = Array.isArray(detailDraft.media_url)
              ? detailDraft.media_url[0]
              : detailDraft.media_url || "";
            setImageUrl(url);
            setIsSelectedDraft(true);
            setFileList([]);
            setTags(detailDraft.tags?.map(getTagName) || []);

            // Update form
            if (updateFormFields) {
              updateFormFields({
                id: detailDraft.id,
                media_name: detailDraft.media_name,
                description: detailDraft.description,
                privacy: mapPrivacyToFormValue(detailDraft.privacy),
                tags_name: detailDraft.tags?.map(getTagName) || [],
              });
            }

            // Mark as fetched
            setFetchedDraftId(draftId);
          }
        } catch (error) {
          toast.error("Error fetching draft details: " + error);
        }
      }
    };

    fetchDraftDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

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
    setDraftId,
    isGeneratingMetadata,

    // Drafts
    drafts,
    loadingDrafts,
    refetchDrafts,

    // Handlers
    handleSelectMedia,
    handleFormChange,
    handleGenerateClick,
    handleGenerateMetadata,
    resetForm,
  };
};
