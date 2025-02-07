import { useState, useContext } from "react";

import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";

export default function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const navList = [
    { route: "/collections", label: "Collections" },
    { route: "/types", label: "Types" },
  ];

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

        <div className="main-links">
          {navList.map((item, index) => (
            <NavLink
              key={index}
              to={item.route}
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        {!isAuthenticated && (
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
            onClick={() => setMenuIsOpen(false)}
          >
            Login
          </NavLink>
        )}

        <div className="navbar-right">
          <div className="switch-wrapper"></div>

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
