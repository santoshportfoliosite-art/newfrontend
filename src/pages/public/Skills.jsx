import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosClient.js";
import ContactMe from "../../components/ContactMe.jsx";
import "./Skills.css";

export default function Skills() {
  const [items, setItems] = useState([]);
  const skillsRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => { 
    api.get("/skills").then(({data}) => setItems(data?.data || [])); 
  }, []);

  /* Floating particles like your other pages (added) */
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
      const p = document.createElement("div");
      p.className = "skills-particle";

      // position across the width; let the keyframes move through viewport
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `0`;

      const size = Math.random() * 3 + 1; // 1–4px
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.setProperty("--driftX", `${(Math.random() * 8 - 4).toFixed(2)}vw`);

      p.style.animationDuration = `${(Math.random() * 10 + 10).toFixed(2)}s`;
      p.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;

      container.appendChild(p);
    }
  }, []);

  /* Reveal-in + progress bars */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Animate progress bars – respect provided data-level
            const progressBar = entry.target.querySelector(".skill-progress-bar");
            if (progressBar) {
              const provided = entry.target.getAttribute("data-level");
              const level = provided ? Number(provided) : Math.floor(Math.random() * 30) + 70;
              progressBar.style.width = `${Math.max(0, Math.min(100, level))}%`;
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (skillsRef.current) {
      const cards = skillsRef.current.querySelectorAll(".skill-card");
      cards.forEach(card => {
        // Only set demo level if none provided
        if (!card.getAttribute("data-level")) {
          card.setAttribute("data-level", String(Math.floor(Math.random() * 30) + 70));
        }
        observer.observe(card);
      });
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <section className="skills-container">
      {/* Full-screen floating particles (new) */}
      <div className="skills-particles" ref={particlesRef} />

      {/* Animated Background Elements (kept) */}
      <div className="skills-bg-element"></div>
      <div className="skills-bg-element"></div>
      
      {/* Skills Header */}
      <div className="skills-header">
        <h2 className="skills-title">My Skills</h2>
      </div>
      
      {/* Skills Grid */}
      <div className="skills-grid" ref={skillsRef}>
        {items.map(skill => (
          <div key={skill._id} className="skill-card" data-level={skill.level || 80}>
            {skill.cover?.url && (
              <img 
                src={skill.cover.url} 
                alt={skill.title} 
                className="skill-image" 
                loading="lazy"
              />
            )}
            <h3 className="skill-title">{skill.title}</h3>
            <div className="skill-progress">
              <div className="skill-progress-bar"></div>
            </div>
          </div>
        ))}
      </div>
      
    
    </section>
  );
}
