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

  // floating particles (kept)
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

      // random horizontal; start from top so each crosses viewport
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `0`;

      const size = Math.random() * 3 + 1; // 1–4px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.setProperty("--driftX", `${(Math.random() * 8 - 4).toFixed(2)}vw`);

      particle.style.animationDuration = `${(Math.random() * 10 + 10).toFixed(2)}s`; // 10–20s
      particle.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;

      container.appendChild(particle);
    }
  }, []);

  // reveal cards + animate optional progress %
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const card = entry.target;
          card.classList.add("visible");

          // progress (only if present)
          const prog = card.querySelector(".education-progress");
          const bar = card.querySelector(".education-progress-bar");
          const percentEl = card.querySelector(".education-progress-percent");

          if (prog && bar) {
            // trigger CSS width fill
            prog.classList.add("is-visible");

            // animate % counter if element exists
            if (percentEl) {
              const raw = card.getAttribute("data-level");
              const target = Math.max(0, Math.min(100, Number(raw || 0)));
              let start = null;
              const dur = 900;
              const step = (ts) => {
                if (!start) start = ts;
                const t = Math.min(1, (ts - start) / dur);
                const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
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
      {/* Full-screen Particles */}
      <div className="education-particles" ref={particlesRef} />

      {/* Education Header */}
      <div className="education-header">
        <h1 className="education-title heading-shimmer heading-underline">
          My Education & Experience
        </h1>
      </div>
      
      {/* Education Timeline */}
      <div className="education-timeline" ref={timelineRef}>
        {items.map((e) => {
          // optional numeric metric to show as % bar (GPA/percentage/etc.)
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

              {/* Optional progress bar shows only when a numeric metric exists */}
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
