import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome, FaUserAlt, FaProjectDiagram, FaPhoneAlt, FaTools, FaGraduationCap
} from "react-icons/fa";
import "./Components.css";

const linkCls = ({ isActive }) => "navlink" + (isActive ? " active" : "");

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  // close menu when route changes
  useEffect(() => { setOpen(false); }, [loc.pathname]);

  return (
    <header className={`navbar ${open ? "nav-open" : ""}`}>
      <nav className="navbar-inner">
        {/* Brand */}
        <div className="brand">
          SANTOSH<span style={{ color: "var(--brand)" }}>&nbsp;THAPA</span>
        </div>

        {/* Desktop links */}
        <div className="nav-links" aria-label="Primary">
          <NavLink to="/" className={linkCls}><FaHome /> Home</NavLink>
          <NavLink to="/about" className={linkCls}><FaUserAlt /> About</NavLink>
          <NavLink to="/projects" className={linkCls}><FaProjectDiagram /> Projects</NavLink>
          <NavLink to="/contact" className={linkCls}><FaPhoneAlt /> Contact</NavLink>
          <NavLink to="/skills" className={linkCls}><FaTools /> Skills</NavLink>
          <NavLink to="/education" className={linkCls}><FaGraduationCap /> Education</NavLink>
        </div>

        {/* Right side (Admin CTA + Hamburger) */}
        <div className="nav-cta">
          <NavLink to="/admin/login" className="btn outline" title="Admin Login">Admin</NavLink>
          <button
            className="hamburger"
            aria-label="Menu"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            <span className="bars" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div id="mobile-menu" className="mobile-menu">
          <div className="mobile-menu-panel">
            <div className="group" role="menu">
              <NavLink to="/" className="mobile-link"><FaHome /> Home</NavLink>
              <NavLink to="/about" className="mobile-link"><FaUserAlt /> About</NavLink>
              <NavLink to="/projects" className="mobile-link"><FaProjectDiagram /> Projects</NavLink>
              <NavLink to="/contact" className="mobile-link"><FaPhoneAlt /> Contact</NavLink>
              <NavLink to="/skills" className="mobile-link"><FaTools /> Skills</NavLink>
              <NavLink to="/education" className="mobile-link"><FaGraduationCap /> Education</NavLink>
              <NavLink to="/admin/login" className="mobile-link">Admin</NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
