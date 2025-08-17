import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserAlt,
  FaProjectDiagram,
  FaPhoneAlt,
  FaTools,
  FaGraduationCap,
} from "react-icons/fa";
import "./Components.css";

const linkCls = ({ isActive }) => "navlink" + (isActive ? " active" : "");

export default function Navbar() {
  const loc = useLocation();

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        {/* Top row: Brand + Admin */}
        <div className="nav-top">
          <div className="brand">
            SANTOSH<span style={{ color: "var(--brand)" }}>&nbsp;THAPA</span>
          </div>
          <div className="nav-cta">
            <NavLink
              to="/admin/login"
              className="btn outline"
              title="Admin Login"
            >
              Admin
            </NavLink>
          </div>
        </div>

        {/* Second row: Navigation links */}
        <div className="nav-links" aria-label="Primary">
          <NavLink to="/" className={linkCls}>
            <FaHome className="icon" />
            <span className="label">Home</span>
          </NavLink>
          <NavLink to="/about" className={linkCls}>
            <FaUserAlt className="icon" />
            <span className="label">About</span>
          </NavLink>
          <NavLink to="/projects" className={linkCls}>
            <FaProjectDiagram className="icon" />
            <span className="label">Projects</span>
          </NavLink>
          <NavLink to="/contact" className={linkCls}>
            <FaPhoneAlt className="icon" />
            <span className="label">Contact</span>
          </NavLink>
          <NavLink to="/skills" className={linkCls}>
            <FaTools className="icon" />
            <span className="label">Skills</span>
          </NavLink>
          <NavLink to="/education" className={linkCls}>
            <FaGraduationCap className="icon" />
            <span className="label">Education</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
