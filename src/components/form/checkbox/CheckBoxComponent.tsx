import React from "react";
import { Checkbox, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface CheckboxWithDescriptionProps {
  title: string;
  description?: string;
  onChange?: (e: CheckboxChangeEvent) => void;
  value?: boolean;
}

const CheckboxWithDescription: React.FC<CheckboxWithDescriptionProps> = ({
  title,
  description,
  onChange,
  value,
}) => {
  return (
    <div className="checkbox-component">
      <div className="checkbox-container">
        <Checkbox
          onChange={onChange}
          checked={value}
          className="custom-checkbox"
        />
        <span className="checkbox-title">{title}</span>
        <Tooltip title={description} placement="top">
          <span className="checkbox-description">
            <QuestionCircleOutlined className="custom-icon" />
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default CheckboxWithDescription;
