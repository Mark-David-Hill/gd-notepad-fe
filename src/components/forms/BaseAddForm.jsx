import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContextProvider";
import FormField from "./FormField";
import useForm from "../../hooks/useForm";
import fetchWrapper from "../../lib/apiCall";

/**
 * Base reusable form component for adding items (collections, items, types, etc.)
 */
export default function BaseAddForm({
  endpoint,
  buttonText = "Add",
  fields,
  onSuccess,
  previewComponent: PreviewComponent,
  previewProps = {},
  requiresAuth = true,
  validateBeforeSubmit = true,
}) {
  const { authInfo } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize form with default values from fields
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});

  const { values, handleChange, reset, validate } = useForm(initialValues);

  // Don't render if auth is required and user is not authenticated
  if (requiresAuth && !authInfo) {
    return null;
  }

  const handleSubmit = async () => {
    // Build validation rules from fields (skip hidden fields)
    const validationRules = fields.reduce((acc, field) => {
      if (field.type === "hidden") return acc;
      
      if (field.required) {
        acc[field.name] = {
          required: true,
          message: field.errorMessage || `${field.label || field.name} is required`,
        };
      }
      if (field.validate) {
        acc[field.name] = {
          ...acc[field.name],
          validate: field.validate,
        };
      }
      return acc;
    }, {});

    // Validate if needed
    if (validateBeforeSubmit && !validate(validationRules)) {
      return;
    }

    // Build request body
    const body = fields.reduce((acc, field) => {
      const value = values[field.name];
      // Include hidden fields and fields with values
      if (field.type === "hidden") {
        // For hidden fields, use defaultValue or transform if provided
        const hiddenValue = field.transform ? field.transform(value) : (field.defaultValue || value);
        if (hiddenValue !== undefined && hiddenValue !== null) {
          acc[field.name] = hiddenValue;
        }
      } else if (value !== undefined && value !== null && value !== "") {
        acc[field.name] = field.transform ? field.transform(value) : value;
      }
      return acc;
    }, {});

    try {
      const response = await fetchWrapper.apiCall(endpoint, "POST", body);
      
      if (onSuccess) {
        onSuccess(response.result || response);
      }
      
      reset();
      setIsOpen(false);
    } catch (error) {
      console.error(`Failed to add item:`, error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsOpen(false);
  };

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)}>{buttonText}</button>;
  }

  return (
    <div className="add-item-wrapper">
      <div className="add-item-form">
        {fields
          .filter((field) => field.type !== "hidden")
          .map((field) => {
            const fieldValue = values[field.name];
            
            let options = null;
            if (field.type === "select" && field.options) {
              options = (
                <>
                  {field.placeholder && (
                    <option value="">{field.placeholder}</option>
                  )}
                  {field.options.map((option) =>
                    typeof option === "object" ? (
                      <option
                        key={option.value}
                        value={option.value}
                        style={option.style}
                      >
                        {option.label}
                      </option>
                    ) : (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    )
                  )}
                </>
              );
            }

            return (
              <FormField
                key={field.name}
                id={field.id || field.name}
                label={field.label}
                type={field.type || "text"}
                value={fieldValue}
                onChange={(e) => handleChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                options={options}
              />
            );
          })}

        <div className="form-buttons">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSubmit}>{buttonText}</button>
        </div>
      </div>
      
      {PreviewComponent && (
        <PreviewComponent
          {...previewProps}
          formData={values}
        />
      )}
    </div>
  );
}

BaseAddForm.propTypes = {
  endpoint: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      type: PropTypes.oneOf(["text", "textarea", "select", "email", "password", "hidden"]),
      placeholder: PropTypes.string,
      required: PropTypes.bool,
      defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      options: PropTypes.array,
      validate: PropTypes.func,
      errorMessage: PropTypes.string,
      transform: PropTypes.func,
    })
  ).isRequired,
  onSuccess: PropTypes.func.isRequired,
  previewComponent: PropTypes.elementType,
  previewProps: PropTypes.object,
  requiresAuth: PropTypes.bool,
  validateBeforeSubmit: PropTypes.bool,
};

