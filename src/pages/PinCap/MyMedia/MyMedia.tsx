import { getMyMedias } from "@/api/media";
import ButtonCircle from "@/components/buttonCircle/ButtonCircle";
import MediaList from "@/components/viewPin/ViewPinComponent";
import { ROUTES } from "@/constants/routes";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons/lib";
import { useNavigate } from "react-router";
import "./MyMedia.less";

const MyMedia = () => {
  const navigate = useNavigate();
  window.scrollTo(0, 0);

  return (
    <div className="media-container">
      <div className="fixed-topbar !sticky top-0 !z-20 bg-white !pb-3 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
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
                navigate(ROUTES.CREATE_MEDIA);
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
            queryFn={(pageParam) =>
              getMyMedias({ pageParam, is_created: true })
            }
            isEditMedia
          />
        </div>
      </div>
    </div>
  );
};

export default MyMedia;
