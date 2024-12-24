import React, { useEffect, useState } from "react";
import "./DetailAlbum.less";
import { useParams } from "react-router";
import MediaList from "../../../components/viewPin/ViewPinComponent";
import { getDetailAlbum } from "../../..//api/album";
import { Album } from "type";
import { toast } from "react-toastify";

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
      {isFetchData && <MediaList medias={albumData?.medias} />}
    </div>
  );
};

export default DetailAlbum;
