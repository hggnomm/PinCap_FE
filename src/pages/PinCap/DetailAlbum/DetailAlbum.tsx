import React, { useEffect, useState } from "react";
import "./DetailAlbum.less";
import { useParams } from "react-router";
import MediaList from "../../../components/viewPin/ViewPinComponent";
import { getDetailAlbum } from "../../..//api/album";
import { Album } from "type";
import { toast } from "react-toastify";
import ButtonCircle from "../../../components/buttonCircle/ButtonCircle";
import { LockFilled, PlusOutlined } from "@ant-design/icons/lib";

const DetailAlbum = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [albumData, setAlbumData] = useState<Album | null>(null);
  const [isFetchData, setIsFetchData] = useState<boolean>(false);
  useEffect(() => {
    return () => {
      if (id) {
        fetchDetailAlbums();
      } else {
        setError("Album ID is missing.");
        toast.error("Album ID is missing.");
      }
    };
  }, [id]);

  const fetchDetailAlbums = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDetailAlbum(id);
      console.log(response);
      if (response) {
        setAlbumData(response);
        setIsFetchData(true);
      }
    } catch (err) {
      setError("Failed to fetch albums. Please try again later.");
      toast.error("Failed to fetch albums. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="album-detail-container">
      <div className="top-container">
        <div className="detail">
          <p className="album_name">{albumData?.album_name}</p>

          {albumData?.privacy === "PRIVATE" && (
            <div className="private">
              <LockFilled />
              <p>Private</p>
            </div>
          )}

          {albumData?.description && (
            <p className="album_description">{albumData?.description}</p>
          )}
        </div>
        <div>
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
                onClick: () => {},
              },
            ]}
          />
        </div>
      </div>
      {isFetchData && <MediaList medias={albumData?.medias} />}
    </div>
  );
};

export default DetailAlbum;
