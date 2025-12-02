import { useState, useCallback } from "react";

/**
 * Custom hook for managing form state
 * @param {Object} initialValues - Initial form values
 * @returns {Object} Form state and handlers
 */
export default function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const setValue = useCallback((field, value) => {
    handleChange(field, value);
  }, [handleChange]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setError = useCallback((field, message) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const validate = useCallback((validationRules) => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach((field) => {
      const rule = validationRules[field];
      const value = values[field];

      if (rule.required && (!value || value.toString().trim() === "")) {
        newErrors[field] = rule.message || `${field} is required`;
      } else if (rule.validate && typeof rule.validate === "function") {
        const error = rule.validate(value);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  return {
    values,
    errors,
    handleChange,
    setValue,
    reset,
    setError,
    validate,
    setValues, // For bulk updates
  };
}

