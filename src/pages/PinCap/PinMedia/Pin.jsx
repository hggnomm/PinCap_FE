import React from "react";
import "./index.less";
import { useNavigate } from "react-router-dom";

const PinMedia = (props) => {
  const navigate = useNavigate();
  const isMp4 = props.srcUrl.endsWith(".mp4");
  const openDetailMedia = (id) => {
    navigate(`/media/${id}`);
  };
  return (
    <div className={`box`} onClick={() => openDetailMedia(props.data?.id)}>
      {isMp4 ? (
        <video controls>
          <source src={props.srcUrl} type="video/mp4" />
        </video>
      ) : (
        <img src={props.srcUrl} alt="" />
      )}
    </div>
  );
};
export default PinMedia;
