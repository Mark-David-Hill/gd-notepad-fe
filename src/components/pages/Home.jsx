import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="login-container">
      <h1>Home</h1>
      <NavLink
        to="/games"
        className={({ isActive }) => (isActive ? "active-link" : undefined)}
        onClick={() => setMenuIsOpen(false)}
      >
        Games
      </NavLink>

      <NavLink
        to="/mechanics"
        className={({ isActive }) => (isActive ? "active-link" : undefined)}
        onClick={() => setMenuIsOpen(false)}
      >
        Mechanics
      </NavLink>

      <NavLink
        to="/levels"
        className={({ isActive }) => (isActive ? "active-link" : undefined)}
        onClick={() => setMenuIsOpen(false)}
      >
        Levels
      </NavLink>

      <NavLink
        to="/level-elements"
        className={({ isActive }) => (isActive ? "active-link" : undefined)}
        onClick={() => setMenuIsOpen(false)}
      >
        Level Elements
      </NavLink>

      <NavLink
        to="/enemy-elements"
        className={({ isActive }) => (isActive ? "active-link" : undefined)}
        onClick={() => setMenuIsOpen(false)}
      >
        Enemy Elements
      </NavLink>

      <NavLink
        to="/power-ups"
        className={({ isActive }) => (isActive ? "active-link" : undefined)}
        onClick={() => setMenuIsOpen(false)}
      >
        Power Ups
      </NavLink>
    </div>
  );
}
