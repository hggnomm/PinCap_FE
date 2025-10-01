import { Collapse } from "antd";
import React, { useEffect, useState } from "react";
import { formatTime } from "@/utils/utils";
import { Media } from "@/types/type";
import { useComment } from "@/hooks/useComment";
import { useInView } from "react-intersection-observer";
import "./ListComments.less";
import Zoom from "react-medium-image-zoom";

interface ListCommentsProps {
  media: Media;
}

const ListComments: React.FC<ListCommentsProps> = ({ media }) => {
  const { getInfiniteComments } = useComment();
  const [allComments, setAllComments] = useState<any[]>([]);
  const { ref, inView } = useInView();

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
  } = getInfiniteComments(media.id || "");

  useEffect(() => {
    if (data?.pages) {
      const flattenedComments = data.pages.flatMap((page) => page?.data || []);
      setAllComments(flattenedComments);
    }
  }, [data]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const displayComments =
    allComments.length > 0
      ? allComments
      : media?.userComments
      ? [media.userComments]
      : [];
  const totalComments = data?.pages?.[0]?.total || media?.commentCount || 0;
  const isLoading = status === "pending";

  return (
    <Collapse ghost expandIconPosition="end" className="user_comment">
      <Collapse.Panel key="1" header={`${totalComments} Comments`}>
        {isLoading && (
          <div className="text-center p-5">
            <div className="inline-block w-5 h-5 border-2 border-gray-200 border-t-rose-600 rounded-full animate-spin"></div>
          </div>
        )}

        {!isLoading && displayComments.length > 0 && (
          <div>
            {displayComments.map((comment: any, index: number) => {
              const isLastComment = index === displayComments.length - 1;

              return (
                <div
                  key={comment.id || index}
                  className="comment !py-2"
                  ref={isLastComment ? ref : undefined}
                >
                  <div className="avatar">
                    <img
                      src={comment.avatar || "/placeholder-user.jpg"}
                      alt="avatar"
                    />
                  </div>
                  <div className="content">
                    <div className="header_content">
                      <strong>{comment.name || "Anonymous"}</strong>
                      <span>{formatTime(comment.created_at ?? "")}</span>
                    </div>

                    <p>{comment.content}</p>
                    {comment.image_url && (
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

        {!isLoading && displayComments.length === 0 && (
          <div className="text-center text-gray-500 p-5">No comments yet</div>
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
