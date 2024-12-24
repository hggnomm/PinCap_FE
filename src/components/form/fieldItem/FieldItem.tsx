import React from "react";
import { Form } from "antd";
import "./FieldItem.less";

interface FieldItemProps {
  label?: string;
  name?: string; 
  rules?: any[]; 
  children: React.ReactNode; 
  placeholder?: string; 
}

const FieldItem: React.FC<FieldItemProps> = ({
  label,
  name,
  rules,
  children,
  placeholder,
}) => {
  return (
    <div className="field-item">
      <span className="text-label">{label}</span>
      <Form.Item name={name} rules={rules}>
        {React.cloneElement(children as React.ReactElement, {
          placeholder: placeholder,
        })}
      </Form.Item>
    </div>
  );
};

export default FieldItem;
