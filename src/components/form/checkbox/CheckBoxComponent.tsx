import React from "react";
import "./CheckBoxComponent.less";
import { Form, Checkbox, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface CheckboxWithDescriptionProps {
  title: string;
  description?: string;
  onChange?: (e: CheckboxChangeEvent) => void;
  value?: boolean;
  name: string;
  rules?: any[];
}

const CheckboxWithDescription: React.FC<CheckboxWithDescriptionProps> = ({
  title,
  description,
  onChange,
  value,
  name,
  rules,
}) => {
  return (
    <Form.Item name={name} valuePropName="checked" rules={rules}>
      <div className="checkbox-component">
        <div className="checkbox-container">
          <Checkbox
            onChange={onChange}
            checked={value}
            className="custom-checkbox"
          />
          <span className="checkbox-title">{title}</span>
          {description && (
            <Tooltip title={description} placement="top">
              <span className="checkbox-description">
                <QuestionCircleOutlined className="custom-icon" />
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    </Form.Item>
  );
};

export default CheckboxWithDescription;
