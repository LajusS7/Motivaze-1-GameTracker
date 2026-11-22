import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

function ProfileMenu() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    logout();
    navigate("/login");
  }

  const initial = (user.username?.[0] || "?").toUpperCase();
  const isDark = theme === "dark";

  return (
    <div className="profile-menu" ref={ref}>
      <button
        type="button"
        className="profile-button"
        aria-label="Open profile menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {initial}
      </button>

      {open && (
        <div className="profile-dropdown" role="menu">
          <div className="profile-header">
            <span className="profile-avatar" aria-hidden="true">
              {initial}
            </span>
            <div>
              <div className="profile-label">Signed in as</div>
              <div className="profile-name">{user.username}</div>
            </div>
          </div>

          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={isDark}
            className="profile-item"
            onClick={toggleTheme}
          >
            <span>{isDark ? "Dark mode" : "Light mode"}</span>
            <span className={`switch ${isDark ? "on" : ""}`} aria-hidden="true">
              <span className="switch-knob" />
            </span>
          </button>

          <button
            type="button"
            role="menuitem"
            className="profile-item danger"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
