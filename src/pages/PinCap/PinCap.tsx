import React from "react";
import MediaList from "../../components/viewPin/ViewPinComponent";
import { getAllMedias } from "../../api/media";

const PinCap = () => {
  return <MediaList apiCall={getAllMedias} />;
};

export default PinCap;
