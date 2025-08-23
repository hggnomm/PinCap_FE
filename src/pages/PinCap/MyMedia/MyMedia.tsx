import React, { useState } from "react";
import "./MyMedia.less";
import ButtonCircle from "../../../components/buttonCircle/ButtonCircle";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons/lib";
import MediaList from "../../../components/viewPin/ViewPinComponent";
import { getMyMedias } from "../../../api/media";
import { useNavigate } from "react-router";

const MyMedia = () => {
  const navigate = useNavigate();
  window.scrollTo(0, 0);

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
          text="Create"
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
          dropdownMenu={[
            {
              key: "1",
              title: "Media",
              onClick: () => {
                navigate("/create-media");
              },
            },
          ]}
        />
      </div>
      <div className="my-list-media">
        <div className="action"></div>
        <div className="list">
          <MediaList 
            queryKey={["medias", "my-media", "created"]}
            queryFn={(pageParam) => getMyMedias({ pageParam, is_created: true })}
            isEditMedia 
          />
        </div>
      </div>
    </div>
  );
};

export default MyMedia;
