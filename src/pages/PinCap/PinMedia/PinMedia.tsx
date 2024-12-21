import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion from framer-motion
import "./index.less";
import { inherits } from "util";

const PinMedia = (props: any) => {
  const navigate = useNavigate();
  const isMp4 = props.srcUrl.endsWith(".mp4");
  const openDetailMedia = (id: string) => {
    navigate(`/media/${id}`);
  };

  return (
    <div
      className="box"
      onClick={() => openDetailMedia(props.data?.id)}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {isMp4 ? (
        <video controls>
          <source src={props.srcUrl} type="video/mp4" />
        </video>
      ) : (
        <img src={props.srcUrl} alt="" />
      )}
      {/* Optional: If you want to add a black overlay on hover */}
      <motion.div
        className="overlay"
        whileHover={{ opacity: 1 }} // Ensures overlay shows up on hover
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          opacity: 0,
          transition: "opacity 0.3s",
          zIndex: 1,
          borderRadius: "15px", // Ensure overlay has the same rounded corners
          height: "100%",
        }}
      />
    </div>
  );
};

export default PinMedia;
