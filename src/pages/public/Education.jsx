import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosClient.js";
import ContactMe from "../../components/ContactMe.jsx";
import "./Education.css";

export default function Education() {
  const [items, setItems] = useState([]);
  const particlesRef = useRef(null);
  const timelineRef = useRef(null);

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

    
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `0`;

      const size = Math.random() * 3 + 1; 
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.setProperty("--driftX", `${(Math.random() * 8 - 4).toFixed(2)}vw`);

      particle.style.animationDuration = `${(Math.random() * 10 + 10).toFixed(2)}s`; 
      particle.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;

      container.appendChild(particle);
    }
  }, []);


  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const card = entry.target;
          card.classList.add("visible");

   
          const prog = card.querySelector(".education-progress");
          const bar = card.querySelector(".education-progress-bar");
          const percentEl = card.querySelector(".education-progress-percent");

          if (prog && bar) {
       
            prog.classList.add("is-visible");


            if (percentEl) {
              const raw = card.getAttribute("data-level");
              const target = Math.max(0, Math.min(100, Number(raw || 0)));
              let start = null;
              const dur = 900;
              const step = (ts) => {
                if (!start) start = ts;
                const t = Math.min(1, (ts - start) / dur);
                const eased = 1 - Math.pow(1 - t, 3); 
                percentEl.textContent = `${Math.round(eased * target)}%`;
                if (t < 1) requestAnimationFrame(step);
              };
              requestAnimationFrame(step);
            }

            io.unobserve(card);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (timelineRef.current) {
      timelineRef.current.querySelectorAll(".education-card").forEach(card => {
        io.observe(card);
      });
    }

    return () => io.disconnect();
  }, [items]);

  return (
    <div className="education-container">

      <div className="education-particles" ref={particlesRef} />


      <div className="education-header">
        <h1 className="education-title heading-shimmer heading-underline">
          My Education & Experience
        </h1>
      </div>
      

      <div className="education-timeline" ref={timelineRef}>
        {items.map((e) => {
  
          const raw = e?.level ?? e?.percent ?? e?.score ?? e?.gradePercent;
          const num = Number(raw);
          const hasMetric = Number.isFinite(num);
          const pct = hasMetric ? Math.max(0, Math.min(100, num)) : null;

          return (
            <div
              key={e._id}
              className="education-card"
              {...(hasMetric ? { "data-level": String(pct) } : {})}
            >
              <h3 className="education-level">{e.level}</h3>
              <div className="education-institution">{e.institution}</div>
              <div className="education-year">{e.year}</div>

      
              {hasMetric && (
                <>
                  <div
                    className="education-progress"
                    style={{ "--to": `${pct}%` }}
                  >
                    <div className="education-progress-bar"></div>
                  </div>
                  
                </>
              )}
            </div>
          );
        })}
      </div>
      

    </div>
  );
}
