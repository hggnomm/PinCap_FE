import React, { useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";
import Zoom from "react-medium-image-zoom";
import { useNavigate } from "react-router-dom";

import { Collapse } from "antd";

import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/react-query/useAuth";
import { useComment } from "@/react-query/useComment";
import { Comment } from "@/types/type";
import { formatTime } from "@/utils/utils";

import "./ListComments.less";

interface ListCommentsProps {
  mediaId: string;
  initialCommentCount?: number;
  defaultOpen?: boolean;
}

const ListComments: React.FC<ListCommentsProps> = ({
  mediaId,
  initialCommentCount = 0,
  defaultOpen = false,
}) => {
  const { getInfiniteComments } = useComment();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { ref, inView } = useInView();

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = getInfiniteComments(mediaId);

  useEffect(() => {
    if (data?.pages) {
      const flattenedComments = data.pages.flatMap((page) => page?.data || []);
      setAllComments(flattenedComments.reverse());
    }
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const displayComments = allComments.length > 0 ? allComments : [];
  const totalComments = data?.pages?.[0]?.total || initialCommentCount;
  const isLoading = status === "pending" || isFetchingNextPage;

  // Handle defaultOpen prop
  useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true);
    }
  }, [defaultOpen]);

  const handleNavigateToProfile = (userId: string) => {
    if (!userId) return;

    if (currentUser && userId === currentUser.id) {
      navigate(ROUTES.PROFILE);
    } else {
      navigate(ROUTES.USER_PROFILE.replace(":id", userId));
    }
  };

  return (
    <Collapse
      ghost
      expandIconPosition="end"
      className="user_comment"
      activeKey={totalComments === 0 ? [] : isOpen ? ["1"] : []}
      onChange={(keys) => {
        setIsOpen(keys.includes("1"));
      }}
    >
      <Collapse.Panel key="1" header={`${totalComments} Comments`}>
        {isLoading && (
          <div className="text-center p-5">
            <div className="inline-block w-5 h-5 border-2 border-gray-200 border-t-rose-600 rounded-full animate-spin"></div>
          </div>
        )}

        {!isLoading && displayComments.length > 0 && (
          <div>
            {displayComments?.map((comment: Comment, index: number) => {
              const isLastComment = index === displayComments.length - 1;

              return (
                <div
                  key={comment?.id ?? index}
                  className="comment !py-2"
                  ref={isLastComment ? ref : undefined}
                >
                  <div
                    className="avatar cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() =>
                      handleNavigateToProfile(comment?.user_id ?? "")
                    }
                  >
                    <img
                      src={comment?.avatar ?? "/placeholder-user.jpg"}
                      alt="avatar"
                    />
                  </div>
                  <div className="content">
                    <div className="header_content">
                      <strong
                        className="cursor-pointer hover:underline"
                        onClick={() =>
                          handleNavigateToProfile(comment?.user_id || "")
                        }
                      >
                        {comment?.name || "Anonymous"}
                      </strong>
                      <span>{formatTime(comment?.created_at || "")}</span>
                    </div>

                    <p>{comment?.content}</p>
                    {comment?.image_url && (
                      <div className="comment_img">
                        <Zoom>
                          <img
                            src={comment.image_url}
                            alt="comment-img"
                            className="cursor-pointer"
                          />
                        </Zoom>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isFetchingNextPage && (
              <div className="text-center p-3">
                <div className="inline-block w-4 h-4 border-2 border-gray-200 border-t-rose-600 rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-500">
                  Loading more comments...
                </span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 p-5">
            Error loading comments. Please try again.
          </div>
        )}
      </Collapse.Panel>
    </Collapse>
  );
};

export default ListComments;
