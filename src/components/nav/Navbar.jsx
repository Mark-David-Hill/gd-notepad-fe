import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { CartContext } from "../context/CartProvider";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../assets/logo.png";

export default function Navbar(props) {
  const { cartItems, isDarkMode, setIsDarkMode } = useContext(CartContext);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <div className="navbar-container">
      <div className="navbar-wrapper">
        <NavLink to="/">
          <img src={logo} alt="Logo" onClick={() => setMenuIsOpen(false)} />
        </NavLink>
        <div className="links-container">
          <div className="main-links">
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
          <div className="cart-button-wrapper">
            <NavLink to="/cart" style={{ textDecoration: "none" }}>
              <div className="cart-button">
                <FontAwesomeIcon icon="fa-cart-shopping" />
                <p>
                  {
                    cartItems.filter((item) => {
                      return item.count > 0;
                    }).length
                  }
                </p>
              </div>
            </NavLink>
          </div>
        </div>
        <div className="navbar-right">
          <div
            className="switch-wrapper"
            onClick={() => {
              setIsDarkMode((prev) => !prev);
            }}
          >
            <button>{isDarkMode ? "Light" : "Dark"}</button>
          </div>
          <div className="hamburger-button-wrapper">
            <button onClick={() => setMenuIsOpen((prev) => !prev)}>
              <FontAwesomeIcon icon="fa-bars" />
            </button>
          </div>
        </div>
      </div>
      <div
        className={"hamburger-menu-wrapper " + (menuIsOpen && "show-menu")}
        onClick={() => setMenuIsOpen(false)}
      >
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </div>
    </div>
  );
}
