import { useState, useContext } from "react";

import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";

export default function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <div className="navbar-container">
      <div className="navbar-wrapper">
        <NavLink
          to={isAuthenticated ? "/dashboard" : "/"}
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
          onClick={() => setMenuIsOpen(false)}
        >
          Home
        </NavLink>

        {!isAuthenticated && (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
            onClick={() => setMenuIsOpen(false)}
          >
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
}
