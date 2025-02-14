import React, { useEffect, useState } from "react";
import "./DetailAlbum.less";
import { useNavigate, useParams } from "react-router";
import MediaList from "../../../components/viewPin/ViewPinComponent";
import {
  deleteMyAlbum,
  getDetailAlbum,
  updateMyAlbum,
} from "../../..//api/album";
import { Album } from "type";
import { toast } from "react-toastify";
import ButtonCircle from "../../../components/buttonCircle/ButtonCircle";
import { LockFilled, MoreOutlined, PlusOutlined } from "@ant-design/icons/lib";
import ModalComponent from "../../../components/modal/ModalComponent";
import { Form, Input } from "antd";
import FieldItem from "../../../components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "../../../components/form/checkbox/CheckBoxComponent";
import { UpdateAlbumRequest } from "Album/AlbumRequest";

const DetailAlbum = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [albumData, setAlbumData] = useState<Album | null>(null);
  const [isFetchData, setIsFetchData] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Modal confirm delete
  const navigate = useNavigate();

  const [privacy, setPrivacy] = useState(false);
  const [form] = Form.useForm();

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

  useEffect(() => {
    if (modalVisible) {
      form.resetFields(); // Reset form fields each time the modal is opened
      if (albumData) {
        setPrivacy(albumData.privacy === "PRIVATE"); // Set privacy based on album's current privacy status

        form.setFieldsValue({
          album_name: albumData.album_name, // Set the album name in the form
        });
      }
    }
  }, [modalVisible, albumData, form]);

  const handleCancel = () => {
    setModalVisible(false);
  };

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

  const handleConfirm = async () => {
    try {
      const formValues = await form.validateFields();
      const albumRequest: UpdateAlbumRequest = {
        album_name: formValues.album_name,
        privacy: privacy ? "0" : "1",
      };

      console.log("Album Request:", albumRequest);
      setModalVisible(false);

      const response = await updateMyAlbum(id, albumRequest);

      if (response) {
        fetchDetailAlbums();
      }
    } catch (error) {
      console.error("Validation failed:", error);
      toast.error(
        "Validation failed: Please check the form fields and try again."
      );
    }
  };
  const handlePrivacyChange = (e: any) => {
    setPrivacy(e.target.checked);
  };

  const handleDeleteAction = () => {
    setDeleteModalVisible(true); // Mở modal xác nhận xóa
    setModalVisible(false); // Ẩn modal chính
  };

  const deleteAlbum = async () => {
    try {
      const response = await deleteMyAlbum(id);

      if (response) {
        handleCancel();
        navigate("/album");
        toast.success("Album deleted successfully!"); // Hiển thị thông báo thành công
      } else {
        toast.error("Failed to delete the album. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting album:", error);
      toast.error(
        "An error occurred while deleting the album. Please try again."
      );
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
              <MoreOutlined
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
                title: "Edit Album",
                onClick: () => {
                  setModalVisible(true);
                },
              },
            ]}
          />
        </div>
      </div>
      {albumData?.medias && albumData.medias.length === 0 && (
        <div className="no-medias">
          <p>There aren’t any Medias on this album yet</p>
        </div>
      )}

      {isFetchData && <MediaList medias={albumData?.medias} isEditMedia />}

      <ModalComponent
        title="Edit Your Album"
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        buttonLabels={{ confirmLabel: "Update", cancelLabel: "Cancel" }}
      >
        <div className="create-album">
          <Form form={form} layout="vertical">
            <FieldItem
              label="Name"
              name="album_name"
              rules={[
                { required: true, message: "Please input the album title!" },
              ]}
              placeholder="Like 'Places to Go' or 'Recipes to Make'"
            >
              <Input />
            </FieldItem>

            <CheckboxWithDescription
              title="Keep this album private"
              description="So only you and collaborator can see it."
              value={privacy}
              onChange={handlePrivacyChange}
              name="privacy"
            />
          </Form>
          {/* Phần xóa album */}
          <div className="delete-action" onClick={handleDeleteAction}>
            <p className="title-delele">Delete album</p>
            <p className="des-delete">
              You have 7 days to restore a deleted Album. After that, it will be
              permanently deleted.
            </p>
          </div>
        </div>
      </ModalComponent>

      {/* Modal xác nhận xóa album */}
      <ModalComponent
        titleDefault="Delete this album?"
        visible={deleteModalVisible}
        onCancel={handleCancel}
        onConfirm={deleteAlbum}
        buttonLabels={{ confirmLabel: "Delete", cancelLabel: "Cancel" }}
      >
        <div
          style={{
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          Are you sure you want to delete this album
          <p
            style={{
              fontWeight: 500,
              fontSize: "1.1em",
              display: "inline",
              marginRight: "5px",
              marginLeft: "5px",
            }}
          >
            {albumData?.album_name}?
          </p>
          This action cannot be undone.
        </div>
      </ModalComponent>
    </div>
  );
};

export default DetailAlbum;
