import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosClient.js";
import ContactMe from "../../components/ContactMe.jsx";
import "./Education.css";

export default function Education() {
  const [items, setItems] = useState([]);
  const particlesRef = useRef(null);

  useEffect(() => { 
    api.get("/education").then(({data}) => setItems(data?.data || [])); 
  }, []);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    const particleCount = 100;
    container.innerHTML = "";

    const colors = [
      "#4facfe", "#00f2fe", "#ff4e50", "#f9d423",
      "#a8ff78", "#78ffd6", "#f857a6", "#ff5858"
    ];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "education-particle";

      // random horizontal position; start from top layer so each crosses viewport
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `0`;

      // size 1–4px
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // color
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];

      // slight horizontal drift per particle
      particle.style.setProperty("--driftX", `${(Math.random() * 8 - 4).toFixed(2)}vw`);

      // timing
      particle.style.animationDuration = `${(Math.random() * 10 + 10).toFixed(2)}s`; // 10–20s
      particle.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;

      container.appendChild(particle);
    }
  }, []);

  return (
    <div className="education-container">
      {/* Full-screen Particles */}
      <div className="education-particles" ref={particlesRef} />

      {/* Education Header */}
      <div className="education-header">
        <h1 className="education-title">My Education & Experience</h1>
      </div>
      
      {/* Education Timeline */}
      <div className="education-timeline">
        {items.map((e) => (
          <div key={e._id} className="education-card">
            <h3 className="education-level">{e.level}</h3>
            <div className="education-institution">{e.institution}</div>
            <div className="education-year">{e.year}</div>
          </div>
        ))}
      </div>
      
      <ContactMe />
    </div>
  );
}
