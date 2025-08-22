import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosClient.js";
import Counter from "../../components/Counter.jsx";
import ContactMe from "../../components/ContactMe.jsx";
import "./Projects.css";

export default function Projects() {
  const [items, setItems] = useState([]);
  const particlesRef = useRef(null);

  useEffect(() => {
    api.get("/projects").then(({ data }) => setItems(data?.data || []));
  }, []);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    const particleCount = 100;
    container.innerHTML = "";


    const styleEl = document.createElement("style");
    let cssBuffer = "";

    
   
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "project-particle";

      
      const size = Math.random() * 3 + 1; 
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      const hue = Math.floor(Math.random() * 360);
      const alpha = 0.7;
      particle.style.background = `hsla(${hue} 90% 70% / ${alpha})`;

      
      const startXPercent = Math.random() * 100; 
      const driftVW = (Math.random() * 8 - 4).toFixed(2); 


      particle.style.left = `${startXPercent}%`;
      particle.style.top = `0`; 

   
      const anim = `particle-float-${i}`;
      const duration = (Math.random() * 10 + 10).toFixed(2); 
      const delay = (Math.random() * 5).toFixed(2) + "s";

  
      cssBuffer += `
        @keyframes ${anim} {
          0%   { transform: translateY(110vh) translateX(0); opacity: 0; }
          10%  { opacity: 0.8; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(-20vh) translateX(${driftVW}vw); opacity: 0; }
        }
      `;

      particle.style.animation = `${anim} ${duration}s linear infinite`;
      particle.style.animationDelay = delay;

      container.appendChild(particle);
    }

    styleEl.textContent = cssBuffer;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
      container.innerHTML = "";
    };
  }, []);

  return (
    <section className="projects-container">
      {/* Full-screen Particles */}
      <div className="projects-particles" ref={particlesRef} />

      {/* Projects Header */}
      <div className="projects-header">
        <h2 className="projects-title">My Amazing Projects</h2>
        <div className="projects-counter">
          Completed: <Counter to={items.length} />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {items.map((project) => (
          <a
            key={project._id}
            className="project-card"
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${project.name} project`}
          >
            {project.cover?.url && (
              <img
                src={project.cover.url}
                alt={project.name}
                className="project-image"
                loading="lazy"
              />
            )}
            <div className="project-overlay">
              <h3 className="project-name">{project.name}</h3>
              <div>
                {(project.technologies || []).map((tech) => (
                  <span key={tech} className="project-tech">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </a>
        ))}
      </div>

     
    </section>
  );
}
