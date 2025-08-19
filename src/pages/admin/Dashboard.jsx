import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const menuItems = [
    { title: "About Setup", path: "/aboutsetup", icon: "📝" },
    { title: "Project Setup", path: "/projectsetup", icon: "💻" },
    { title: "Contact Setup", path: "/contactsetup", icon: "📱" },
    { title: "Skill Setup", path: "/skillsetup", icon: "⚡" },
    { title: "CV Link Setup", path: "/cv", icon: "📄" },
    { title: "Messages", path: "/messages", icon: "✉️" },
    { title: "Education Setup", path: "/educationsetup", icon: "🎓" },
  ];

  return (
    <section className="dashboard-container">
      <h2 className="dashboard-title">Portfolio Dashboard</h2>
      
      <div className="dashboard-grid">
        {menuItems.map((item, index) => (
          <Link 
            to={item.path} 
            className="dashboard-card"
            key={index}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span className="card-icon">{item.icon}</span>
            <h3 className="card-title">{item.title}</h3>
            <div className="card-hover-effect"></div>
          </Link>
        ))}
      </div>
    </section>
  );
}