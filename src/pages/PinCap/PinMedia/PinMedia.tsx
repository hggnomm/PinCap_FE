import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./index.less";

const PinMedia = (props: any) => {
  const navigate = useNavigate();
  const isMp4 = props.srcUrl.endsWith(".mp4");

  const openDetailMedia = (id: string) => {
    navigate(`/media/${id}`);
  };

  return (
    <motion.div
      className="box"
      onClick={() => openDetailMedia(props.data?.id)}
      style={{ position: "relative", overflow: "hidden" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {isMp4 ? (
        <video controls>
          <source src={props.srcUrl} type="video/mp4" />
        </video>
      ) : (
        <img src={props.srcUrl} alt="" />
      )}
      <motion.div
        className="overlay"
        whileHover={{ opacity: 1 }}
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
          borderRadius: "15px",
          height: "100%",
        }}
      />
    </motion.div>
  );
};

export default PinMedia;