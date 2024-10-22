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
              to="/mechanics"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Mechanics
            </NavLink>

            <NavLink
              to="/levels"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Levels
            </NavLink>

            <NavLink
              to="/level-elements"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Level Elements
            </NavLink>

            <NavLink
              to="/enemy-elements"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Enemy Elements
            </NavLink>

            <NavLink
              to="/power-ups"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Power Ups
            </NavLink>

            {!auth && (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "active-link" : undefined
                }
                onClick={() => setMenuIsOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>

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
