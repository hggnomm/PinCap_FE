import { cloneElement, type ReactElement, type ReactNode } from "react";

import type { Rule } from "antd/es/form";

import { Form } from "antd";

import "./FieldItem.less";

interface FieldItemProps {
  label?: string;
  name?: string;
  rules?: unknown[];
  children: ReactNode;
  placeholder?: string;
  validateStatus?: "success" | "warning" | "error" | "validating" | "";
  help?: string;
}

const FieldItem = ({
  label,
  name,
  rules,
  children,
  placeholder,
  validateStatus,
  help,
}: FieldItemProps) => {
  return (
    <div className="field-item">
      {label && <label className="text-label">{label}</label>}
      <Form.Item
        name={name}
        rules={rules as Rule[]}
        validateStatus={validateStatus}
        help={help}
      >
        {cloneElement(children as ReactElement, {
          placeholder: placeholder,
        })}
      </Form.Item>
    </div>
  );
};

export default FieldItem;
