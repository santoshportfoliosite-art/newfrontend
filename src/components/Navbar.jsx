import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserAlt,
  FaProjectDiagram,
  FaPhoneAlt,
  FaTools,
  FaGraduationCap,
} from "react-icons/fa";
import "./navbar.css";

const Navbar = () => {
  const isActiveLink = ({ isActive }) => 
    `navlink ${isActive ? "active" : ""}`;

  return (
    <header className="navbar">
      <nav className="navbar-inner">
        {/* Top row: Brand + Admin */}
        <div className="nav-top">
          <div className="brand">
            SANTOSH<span className="brand-highlight"> THAPA</span>
          </div>
          
          <div className="nav-cta">
            <NavLink
              to="/admin/login"
              className="admin-btn"
              title="Admin Login"
            >
              Admin
            </NavLink>
          </div>
        </div>

        {/* Navigation links */}
        <div className="nav-links" aria-label="Primary">
          <NavLink to="/" className={isActiveLink}>
            <FaHome className="icon" />
            <span className="label">Home</span>
          </NavLink>
          <NavLink to="/about" className={isActiveLink}>
            <FaUserAlt className="icon" />
            <span className="label">About</span>
          </NavLink>
          <NavLink to="/projects" className={isActiveLink}>
            <FaProjectDiagram className="icon" />
            <span className="label">Projects</span>
          </NavLink>
          <NavLink to="/contact" className={isActiveLink}>
            <FaPhoneAlt className="icon" />
            <span className="label">Contact</span>
          </NavLink>
          <NavLink to="/skills" className={isActiveLink}>
            <FaTools className="icon" />
            <span className="label">Skills</span>
          </NavLink>
          <NavLink to="/education" className={isActiveLink}>
            <FaGraduationCap className="icon" />
            <span className="label">Education</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;