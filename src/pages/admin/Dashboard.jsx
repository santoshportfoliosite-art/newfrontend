import { Link } from "react-router-dom";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function Dashboard() {
  return (
    <section className="container">
      <h2>Portfolio Dashboard</h2>
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        <Link to="/aboutsetup" className="card">About Setup</Link>
        <Link to="/projectsetup" className="card">Project Setup</Link>
        <Link to="/contactsetup" className="card">Contact Setup</Link>
        <Link to="/skillsetup" className="card">Skill Setup</Link>
        <Link to="/cv" className="card">CV Link Setup</Link>
        <Link to="/messages" className="card">Messages</Link>
        <Link to="/educationsetup" className="card">Education Setup</Link>
      </div>
    </section>
  );
}
