import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../context/AuthContextProvider";
import LoadingSpinner from "./LoadingSpinner";

/**
 * ProtectedRoute component that redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
};
