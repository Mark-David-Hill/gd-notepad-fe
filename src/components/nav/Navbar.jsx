import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <div className="navbar-container">
      <div className="navbar-wrapper">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
          onClick={() => setMenuIsOpen(false)}
        >
          Home
        </NavLink>

        <div className="links-container">
          <div className="main-links">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Products
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              onClick={() => setMenuIsOpen(false)}
            >
              Contact
            </NavLink>
          </div>

          <div className="cart-button-wrapper">
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
              style={{ textDecoration: "none" }}
              onClick={() => setMenuIsOpen(false)}
            >
              Cart
            </NavLink>
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

      <div
        className={"hamburger-menu-wrapper " + (menuIsOpen ? "show-menu" : "")}
        onClick={() => setMenuIsOpen(false)}
      >
        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
          onClick={() => setMenuIsOpen(false)}
        >
          Products
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
          onClick={() => setMenuIsOpen(false)}
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
          onClick={() => setMenuIsOpen(false)}
        >
          Contact
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) => (isActive ? "active-link" : undefined)}
          onClick={() => setMenuIsOpen(false)}
        >
          Cart
        </NavLink>
      </div>
    </div>
  );
}
