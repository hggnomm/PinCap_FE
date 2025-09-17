import React, { useState } from 'react';
import { Form, Input, Button, Select, Checkbox, Space } from 'antd';
import { useFormValidation } from '@/hooks/useFormValidation';
import { loginSchema, LoginFormData } from '@/validation';
import ValidationError from '../ValidationError/ValidationError';

const FormExample: React.FC = () => {
  const [formData, setFormData] = useState<Partial<LoginFormData>>({});
  const { validate, getFieldError, clearErrors } = useFormValidation(loginSchema);

  const handleSubmit = (values: any) => {
    if (validate(values)) {
      console.log('Form is valid:', values);
      // Handle form submission
    } else {
      console.log('Form validation failed');
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>Form Validation Example</h2>
      
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Email">
          <Input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            status={getFieldError('email') ? 'error' : ''}
          />
          {getFieldError('email') && (
            <ValidationError error={getFieldError('email')} />
          )}
        </Form.Item>

        <Form.Item label="Password">
          <Input.Password
            value={formData.password || ''}
            onChange={(e) => handleFieldChange('password', e.target.value)}
            status={getFieldError('password') ? 'error' : ''}
          />
          {getFieldError('password') && (
            <ValidationError error={getFieldError('password')} />
          )}
        </Form.Item>

        <Form.Item>
          <Checkbox
            checked={formData.remember || false}
            onChange={(e) => handleFieldChange('remember', e.target.checked)}
          >
            Remember me
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={clearErrors}>
              Clear Errors
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormExample;
