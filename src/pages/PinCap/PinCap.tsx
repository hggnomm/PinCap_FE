import React from "react";
import MediaList from "@/components/viewPin/ViewPinComponent";
import { getAllMedias } from "@/api/media";

const PinCap = () => {
  window.scrollTo(0, 0);

  return (
    <MediaList
      queryKey={["medias", "all"]}
      queryFn={(pageParam) => getAllMedias({ pageParam })}
    />
  );
};

export default PinCap;
