import { useState, useContext } from "react";

import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";

import fetchWrapper from "../../lib/apiCall";

export default function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  async function logoutUser(email, password) {
    const body = { email, password };

    try {
      const response = await fetchWrapper.apiCall(`/user/logout`, "POST", {});
      console.log(response);
      if (response.message === "Logout successful") {
        setIsAuthenticated(false);
        // navigate("/dashboard");
      } else {
        console.error("Logout failed:", response.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

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

        {isAuthenticated ? (
          <button onClick={logoutUser}>Logout</button>
        ) : (
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
