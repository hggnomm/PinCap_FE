import React from "react";

import "@/components/Form/checkbox/CheckBoxComponent.less";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import type { Rule } from "antd/es/form";

import { Checkbox, Form } from "antd";

import InfoTooltip from "@/components/Tooltip/InfoTooltip";

interface CheckboxWithDescriptionProps {
  title: string;
  description?: string;
  onChange?: (e: CheckboxChangeEvent) => void;
  value?: boolean;
  name: string;
  rules?: Rule[];
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
          {description && <InfoTooltip title={description} />}
        </div>
      </div>
    </Form.Item>
  );
};

export default CheckboxWithDescription;
