import React, { useState } from "react";
import "./MyMedia.less";
import ButtonCircle from "../../../components/buttonCircle/ButtonCircle";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons/lib";
import MediaList from "../../../components/viewPin/ViewPinComponent";
import { getMyMedias } from "../../../api/media";

const MyMedia = () => {
  return (
    <div className="media-container">
      <div className="fixed-topbar">
        <div className="text-head">
          <span>All Medias</span>
        </div>
        <ButtonCircle
          paddingClass="padding-0-8"
          icon={
            <FilterOutlined
              style={{
                fontSize: "26px",
                strokeWidth: "30",
                stroke: "black",
              }}
            />
          }
        />
        <ButtonCircle
          paddingClass="padding-0-8"
          icon={
            <PlusOutlined
              style={{
                fontSize: "26px",
                strokeWidth: "40",
                stroke: "black",
              }}
            />
          }
        />
      </div>
      <div className="my-list-media">
        <div className="action"></div>
        <div className="list">
          <MediaList apiCall={getMyMedias} extraParams={1} />
        </div>
      </div>
    </div>
  );
};

export default MyMedia;
