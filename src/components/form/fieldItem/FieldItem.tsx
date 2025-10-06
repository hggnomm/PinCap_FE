import React from "react";
import { Form } from "antd";
import "./FieldItem.less";

interface FieldItemProps {
  label?: string;
  name?: string; 
  rules?: any[]; 
  children: React.ReactNode; 
  placeholder?: string;
  validateStatus?: 'success' | 'warning' | 'error' | 'validating' | '';
  help?: string;
}

const FieldItem: React.FC<FieldItemProps> = ({
  label,
  name,
  rules,
  children,
  placeholder,
  validateStatus,
  help,
}) => {
  return (
    <div className="field-item">
      {label && (
        <label className="text-label">
          {label}
        </label>
      )}
      <Form.Item 
        name={name} 
        rules={rules}
        validateStatus={validateStatus}
        help={help}
      >
        {React.cloneElement(children as React.ReactElement, {
          placeholder: placeholder,
        })}
      </Form.Item>
    </div>
  );
};

export default FieldItem;
