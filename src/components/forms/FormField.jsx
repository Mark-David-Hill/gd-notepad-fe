import PropTypes from "prop-types";

/**
 * Reusable form field component
 */
export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  options = null, // For select fields
  className = "",
}) {
  const fieldId = id || `field-${label?.toLowerCase().replace(/\s+/g, "-")}`;

  const renderInput = () => {
    if (type === "textarea") {
      return (
        <textarea
          id={fieldId}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={className}
        />
      );
    }

    if (type === "select" && options) {
      return (
        <select
          id={fieldId}
          value={value}
          onChange={onChange}
          required={required}
          className={className}
        >
          {options}
        </select>
      );
    }

    return (
      <input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={className}
      />
    );
  };

  return (
    <div className="form-field">
      {label && (
        <label htmlFor={fieldId}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      {renderInput()}
    </div>
  );
}

FormField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.oneOf(["text", "textarea", "select", "email", "password"]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.node,
  className: PropTypes.string,
};

