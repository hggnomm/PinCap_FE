import React, { useState } from "react";
import { Form, Input } from "antd";
import ModalComponent from "@/components/modal/ModalComponent";
import FieldItem from "@/components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "@/components/form/checkbox/CheckBoxComponent";

interface CreateAlbumModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (data: { album_name: string; privacy: string }) => Promise<void>;
  loading?: boolean;
}

const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [privacy, setPrivacy] = useState(false);

  const handleConfirm = async () => {
    try {
      const formValues = await form.validateFields();
      
      const data = {
        album_name: formValues.album_name,
        privacy: privacy && "0" || "1", // 0 = private, 1 = public
      };
      
      await onConfirm(data);
      
      // Reset form after successful creation
      form.resetFields();
      setPrivacy(false);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPrivacy(false);
    onCancel();
  };

  const handlePrivacyChange = (e: any) => {
    setPrivacy(e.target.checked);
  };

  return (
    <ModalComponent
      title="Create New Album"
      visible={visible}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      buttonLabels={{ confirmLabel: "Create", cancelLabel: "Cancel" }}
      className="!w-[600px]"
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
      </div>
    </ModalComponent>
  );
};

export default CreateAlbumModal;
