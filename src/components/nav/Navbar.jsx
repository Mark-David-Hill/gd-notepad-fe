import { useContext } from "react";

import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { ThemeContext } from "../context/ThemeContextProvider";

export default function Navbar() {
  const { authInfo, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isDarkMode = theme === "dark";

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

        <div className="navbar-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          >
            <span aria-hidden="true" className="theme-toggle__icon">
              {isDarkMode ? "🌙" : "☀️"}
            </span>
            <span className="theme-toggle__label">
              {isDarkMode ? "Dark" : "Light"} mode
            </span>
          </button>

          {authInfo ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
