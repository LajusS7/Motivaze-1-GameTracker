import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import ProfileMenu from "./ProfileMenu.jsx";

function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <h2>Team Workspace</h2>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/catalog">Catalog</NavLink>

        {user ? (
          <ProfileMenu />
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Register</NavLink>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
