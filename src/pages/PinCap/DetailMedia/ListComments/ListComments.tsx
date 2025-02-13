import { Collapse } from "antd";
import React from "react";
import { formatTime } from "../../../../utils/utils";
import { Media } from "../../../../types/type";
import "./ListComments.less";
const ListComments = ({ media }: { media: Media }) => {
  return (
    <Collapse ghost expandIconPosition="end" className="user_comment">
      <Collapse.Panel key="1" header={`${media?.commentCount} Comments`}>
        <div className="comment">
          <div className="avatar">
            <img src={media?.userComments?.avatar} alt="avatar" />
          </div>
          <div className="content">
            <div className="header_content">
              <strong>{media?.userComments?.name}</strong>
              <span>{formatTime(media?.userComments?.created_at ?? "")}</span>
            </div>

            <p>{media?.userComments?.content}</p>
            {media?.userComments?.image_url && (
              <img src={media?.userComments?.image_url} alt="comment-img" />
            )}
          </div>
        </div>
      </Collapse.Panel>
    </Collapse>
  );
};

export default ListComments;
