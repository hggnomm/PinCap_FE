import { getAllMedias } from "@/api/media";
import MediaList from "@/components/viewPin/ViewPinComponent";

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
