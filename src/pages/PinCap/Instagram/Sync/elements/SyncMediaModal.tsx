"use client";

import { useEffect } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle } from "lucide-react";

import { syncInstagramMedias } from "@/api/instagram";
import Loading from "@/components/Loading/Loading";
import ModalComponent from "@/components/Modal/ModalComponent";
import { InstagramMedia } from "@/types/instagram";
import { showErrorToast } from "@/utils/apiErrorHandler";

interface SyncMediaModalProps {
  post: InstagramMedia | null;
  previewUrl: string | null;
  open: boolean;
  onClose: () => void;
}

const SyncMediaModal = ({
  post,
  previewUrl,
  open,
  onClose,
}: SyncMediaModalProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError, reset, error } = useMutation({
    mutationFn: (postId: string) => syncInstagramMedias([postId]),
    onSuccess: async () => {
      // Invalidate Instagram medias query
      await queryClient.invalidateQueries({ queryKey: ["instagram-medias"] });

      // Invalidate my media queries to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ["medias", "my-media"] });
      await queryClient.invalidateQueries({
        queryKey: ["medias", "my-media", "created"],
      });

      // Invalidate all medias query to update the list
      await queryClient.invalidateQueries({ queryKey: ["medias", "all"] });
    },
  });

  useEffect(() => {
    if (error) {
      showErrorToast(error, "Failed to sync Instagram post");
    }
  }, [error]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleConfirm = () => {
    if (!post || isPending) return;
    mutate(post.id);
  };

  const renderContent = () => {
    if (!post) {
      return (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
          Missing post information.
        </div>
      );
    }

    if (isSuccess) {
      return (
        <div className="rounded-xl border border-green-100 bg-green-50 p-6 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-green-700">
            Sync completed
          </h3>
          <p className="text-sm text-green-600">
            This Instagram post has been synced successfully.
          </p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-red-700">
            Sync failed
          </h3>
          <p className="text-sm text-red-600">
            Something went wrong. Please try again.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6 text-sm text-gray-600">
        <p>
          You are about to sync the selected Instagram post to PinCap. This will
          import the media files into your library.
        </p>
        {previewUrl && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-full max-w-sm max-h-[70vh]">
              <img
                src={previewUrl}
                alt={post.caption || "Instagram preview"}
                className="h-full w-full rounded-lg object-contain"
              />
            </div>
            {post.caption && (
              <p className="line-clamp-2 text-xs text-gray-500">
                {post.caption}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <ModalComponent
      title="Sync Instagram Post"
      visible={open}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      confirmLoading={isPending}
      buttonLabels={{ confirmLabel: "Sync now", cancelLabel: "Close" }}
      hideConfirmButton={isSuccess}
      showFooter
      bodyClassName="!max-h-[85vh] !overflow-hidden"
    >
      <Loading isLoading={isPending} blurContent={false} overlayStyle="cover">
        {renderContent()}
        {isPending && (
          <p className="mt-4 text-center text-sm font-medium text-gray-600">
            Syncing... please wait
          </p>
        )}
      </Loading>
    </ModalComponent>
  );
};

export default SyncMediaModal;
