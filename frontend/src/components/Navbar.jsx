/**
 * components/Navbar.jsx
 * Fixed top navigation bar with responsive mobile menu.
 */

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon">💼</div>
          Job<span>Portal</span>
        </Link>

        {/* Mobile toggle */}
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Nav links */}
        <ul className={`navbar-nav${menuOpen ? " open" : ""}`}>
          <li>
            <NavLink to="/jobs" onClick={closeMenu}>
              Find Jobs
            </NavLink>
          </li>

          {!user ? (
            <>
              <li>
                <NavLink to="/login" onClick={closeMenu}>
                  Login
                </NavLink>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMenu}>
                  Sign Up
                </Link>
              </li>
            </>
          ) : user.role === "recruiter" ? (
            <>
              <li>
                <NavLink to="/dashboard" onClick={closeMenu}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/post-job" onClick={closeMenu}>
                  Post Job
                </NavLink>
              </li>
              <li>
                <NavLink to="/company-profile" onClick={closeMenu}>
                  Company
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" onClick={closeMenu}>
                  Profile
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/my-applications" onClick={closeMenu}>
                  My Applications
                </NavLink>
              </li>
              <li>
                <NavLink to="/saved-jobs" onClick={closeMenu}>
                  Saved Jobs
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" onClick={closeMenu}>
                  Profile
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
