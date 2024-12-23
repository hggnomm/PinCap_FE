import React, { useEffect, useState } from "react";
import "./MyAlbum.less";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons/lib";
import ButtonCircle from "../../../components/buttonCircle/ButtonCircle";
import { getAlbumData } from "../../../api/album";
import { Album } from "type";

const MyAlbum = () => {
  const [activeButton, setActiveButton] = useState("saved");
  const [albumData, setAlbumData] = useState<Album[]>([]);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    const response = await getAlbumData();
    if (response) {
      setAlbumData(response.data);
    }
  };

  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };

  return (
    <div className="album-container">
      <div className="fixed-topbar">
        <button
          className={activeButton === "created" ? "active" : ""}
          onClick={() => handleButtonClick("created")}
        >
          <p>Created</p>
        </button>
        <button
          className={activeButton === "saved" ? "active" : ""}
          onClick={() => handleButtonClick("saved")}
        >
          <p>Saved</p>
        </button>
      </div>
      <div className="my-list-media">
        <div className="action">
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
          />
        </div>
        <div className="list">
          {albumData.length > 0 ? (
            albumData.map((album: Album) => (
              <div key={album.id} className="album-item">
                <img
                  src={album.image_cover}
                  alt={album.image_cover}
                  className="album-cover"
                />
                <p className="album-title">{album.album_name}</p>
                <p className="album-description">{album.description}</p>
              </div>
            ))
          ) : (
            <p>No albums available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAlbum;
