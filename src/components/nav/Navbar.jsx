import { useContext } from "react";

import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";

export default function Navbar() {
  const { authInfo, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="navbar-container">
      <div className="navbar-wrapper">
        <NavLink
          to={authInfo ? "/dashboard" : "/"}
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
        >
          Home
        </NavLink>

        {authInfo ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
}
