import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar({ auth }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <div className="navbar-container">
      <div className="navbar-wrapper">
        <NavLink
          to={auth ? "/dashboard" : "/"}
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
          onClick={() => setMenuIsOpen(false)}
        >
          Home
        </NavLink>

        <div className="links-container">
          <div className="main-links">
            <NavLink
              to="/games"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Games
            </NavLink>

            <NavLink
              to="/types"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Types
            </NavLink>

            <NavLink
              to="/game-elements"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Game Elements
            </NavLink>

            <NavLink
              to="/relationships"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Element Relationships
            </NavLink>
          </div>
        </div>
        {!auth && (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
            onClick={() => setMenuIsOpen(false)}
          >
            Login
          </NavLink>
        )}

        <div className="navbar-right">
          <div className="switch-wrapper">
            {/* Dark Mode Switch */}
            {/* <button>{isDarkMode ? "Light" : "Dark"}</button> */}
          </div>

          <div className="hamburger-button-wrapper">
            {/* <button onClick={() => setMenuIsOpen((prev) => !prev)}>
              Hamburger Icon
              <FontAwesomeIcon icon="fa-bars" />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
