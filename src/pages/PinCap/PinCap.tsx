import { getAllMedias } from "@/api/media";
import MediaList from "@/components/ViewPin/ViewPinComponent";

const PinCap = () => {
  window.scrollTo(0, 0);

  return (
    <MediaList
      queryKey={["medias", "all"]}
      queryFn={(pageParam) => getAllMedias({ page: pageParam })}
      refetchOnMount="always"
      staleTime={0}
    />
  );
};

export default PinCap;
