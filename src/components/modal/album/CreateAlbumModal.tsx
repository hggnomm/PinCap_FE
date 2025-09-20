import React, { useState } from "react";
import { Form, Input, notification } from "antd";
import ModalComponent from "@/components/modal/ModalComponent";
import FieldItem from "@/components/form/fieldItem/FieldItem";
import CheckboxWithDescription from "@/components/form/checkbox/CheckBoxComponent";
import { createAlbumSchema } from "@/validation/album";
import { useFormValidation } from "@/hooks";

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
  const { validate, validateField, getFieldError } = useFormValidation(createAlbumSchema);

  const handleConfirm = async () => {
    if (loading) return; // Prevent multiple submissions
    
    try {
      const formValues = await form.validateFields();
      
      const data = {
        album_name: formValues.album_name,
        privacy: privacy && "0" || "1", // 0 = private, 1 = public
      };

      // Validate with Zod before submitting
      if (!validate(data)) {
        notification.warning({
          message: "Validation Error",
          description: "Please check your input and try again.",
        });
        return;
      }
      
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
      buttonLabels={{ 
        confirmLabel: "Create", 
        cancelLabel: "Cancel" 
      }}
      className="!w-[700px]"
    >
      <div className="create-album">
        <Form form={form} layout="vertical">
          <FieldItem
            label="Name"
            name="album_name"
            validateStatus={getFieldError('album_name') ? 'error' : ''}
            help={getFieldError('album_name')}
            rules={[
              { required: true, message: "Please input the album title!" },
            ]}
            placeholder="Like 'Places to Go' or 'Recipes to Make'"
          >
            <Input 
              onChange={(e) => validateField('album_name', e.target.value)}
              onBlur={(e) => validateField('album_name', e.target.value)}
            />
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
