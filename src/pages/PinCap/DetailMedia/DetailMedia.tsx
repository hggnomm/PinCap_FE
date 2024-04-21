import React, { useEffect, useState } from "react";
import "./index.less";
import { useParams } from "react-router-dom";
import { getDetailMedia } from "../../../api/media";
import { Col, Row } from "antd";

const DetailMedia = () => {
  const [media, setMedia] = useState({});
  const { id } = useParams();

  useEffect(() => {
    detailMedia(id);
  }, []);

  const detailMedia = async (idMedia) => {
    const detailMedia = await getDetailMedia(idMedia);
    if (detailMedia) {
      setMedia(detailMedia);
    }
  };

  return (
    <>
      <Row className="detail-media-container">
        <Col className="media-url">
          <img src={media?.media?.mediaURL} alt="" />
        </Col>
        <Col className="detail-infor">
          <h1 style={{ marginBottom: "1rem" }}>{media?.media?.mediaName}</h1>
          <h3 style={{ marginBottom: "3rem" }}>{media?.media?.description}</h3>
          <h3>
            {media?.media?.user_owner?.firstName}
            {media?.media?.user_owner?.lastName}
          </h3>
          <h3></h3>
        </Col>
      </Row>
    </>
  );
};

export default DetailMedia;
