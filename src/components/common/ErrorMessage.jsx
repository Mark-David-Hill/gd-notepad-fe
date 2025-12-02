import PropTypes from "prop-types";

/**
 * Reusable error message component
 */
export default function ErrorMessage({ message, className = "" }) {
  if (!message) return null;

  return (
    <div className={`error-message ${className}`}>
      <p>Error: {message}</p>
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};

