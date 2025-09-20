import { useState } from 'react';
import { z } from 'zod';

export const useFormValidation = <T extends z.ZodSchema>(schema: T) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): data is z.infer<T> => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err: any) => {
          const field = err.path.join('.');
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const validateField = (field: string, value: unknown): boolean => {
    try {
      const fieldSchema = (schema as any).pick({ [field]: true });
      fieldSchema.parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.issues.find((err: any) => err.path[0] === field);
        if (fieldError) {
          setErrors(prev => ({ ...prev, [field]: fieldError.message }));
        }
      }
      return false;
    }
  };

  const getFieldError = (field: string): string => {
    return errors[field] || '';
  };

  return {
    errors,
    validate,
    validateField,
    getFieldError,
  };
};
