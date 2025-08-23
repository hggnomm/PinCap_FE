import React from 'react';
import { Alert } from 'antd';

interface ValidationErrorProps {
  error?: string;
  className?: string;
}

const ValidationError: React.FC<ValidationErrorProps> = ({ error, className }) => {
  if (!error) return null;

  return (
    <Alert
      message={error}
      type="error"
      showIcon
      className={className}
      style={{ marginBottom: 16 }}
    />
  );
};

export default ValidationError;
