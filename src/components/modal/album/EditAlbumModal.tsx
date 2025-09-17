import React, { useEffect } from "react";
import { Form, Input } from "antd";
import ModalComponent from "@/components/modal/ModalComponent";
import FieldItem from "@/components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "@/components/form/checkbox/CheckBoxComponent";
import CollaboratorsSection from "@/components/collaborators/CollaboratorsSection";
import { Album } from "type";
import { UpdateAlbumRequest } from "Album/AlbumRequest";

interface EditAlbumModalProps {
  visible: boolean;
  album: Album | null;
  onCancel: () => void;
  onConfirm: (albumRequest: UpdateAlbumRequest) => Promise<void>;
  onDeleteClick: () => void;
  onInviteCollaborators: () => void;
  loading?: boolean;
}

const EditAlbumModal: React.FC<EditAlbumModalProps> = ({
  visible,
  album,
  onCancel,
  onConfirm,
  onDeleteClick,
  onInviteCollaborators,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [privacy, setPrivacy] = React.useState(false);

  useEffect(() => {
    if (visible && album) {
      form.resetFields();
      setPrivacy(album.privacy === "PRIVATE");
      form.setFieldsValue({
        album_name: album.album_name,
      });
    }
  }, [visible, album, form]);

  const handleConfirm = async () => {
    try {
      const formValues = await form.validateFields();
      const albumRequest: UpdateAlbumRequest = {
        album_name: formValues.album_name,
        privacy: privacy ? "0" : "1",
      };
      
      await onConfirm(albumRequest);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePrivacyChange = (e: any) => {
    setPrivacy(e.target.checked);
  };

  return (
    <ModalComponent
      title="Edit Your Album"
      visible={visible}
      onCancel={onCancel}
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
        
        {/* Collaborators Section */}
        <CollaboratorsSection
          onAddCollaborator={onInviteCollaborators}
          className="mt-6"
          showLearnMore={false}
        />

        {/* Delete Album Section */}
        <div className="delete-action cursor-pointer p-1 text-left hover:scale-[0.99] hover:bg-gray-100 transition-transform" onClick={onDeleteClick}>
          <p className="font-medium text-xl text-gray-900">Delete album</p>
          <p className="text-gray-500 font-medium">
            You have 7 days to restore a deleted Album. After that, it will
            be permanently deleted.
          </p>
        </div>
      </div>
    </ModalComponent>
  );
};

export default EditAlbumModal;
