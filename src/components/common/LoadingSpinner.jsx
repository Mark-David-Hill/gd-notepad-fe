import PropTypes from "prop-types";

/**
 * Reusable loading spinner component
 */
export default function LoadingSpinner({ message = "Loading..." }) {
  return <p>{message}</p>;
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

