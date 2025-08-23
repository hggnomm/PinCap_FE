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
        error.errors.forEach((err) => {
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
      schema.pick({ [field]: true } as any).parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path[0] === field);
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

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validate,
    validateField,
    getFieldError,
    clearErrors,
  };
};
