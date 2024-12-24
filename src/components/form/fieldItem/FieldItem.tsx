import React from "react";
import "./FieldItem.less";

interface FieldItemProps {
  label?: string;
  children: React.ReactNode; 
  placeholder?: string;
}

const FieldItem: React.FC<FieldItemProps> = ({
  label,
  children,
  placeholder,
}) => {
  return (
    <div className="field-item">
      {label && <span className="text-label">{label}</span>}
      {React.cloneElement(children as React.ReactElement, {
        placeholder: placeholder,
      })}
    </div>
  );
};

export default FieldItem;
