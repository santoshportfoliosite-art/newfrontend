import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosClient.js";
import ContactMe from "../../components/ContactMe.jsx";
import "./About.css";

export default function About() {
  const [data, setData] = useState(null);
  const starsRef = useRef(null);
  
  useEffect(() => { 
    api.get("/about").then(({data}) => setData(data?.data || null)); 
  }, []);

  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;
    
    const starCount = 100;
    container.innerHTML = '';

    // Inject keyframes once (twinkle + drift)
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes star-twinkle {
        0%   { opacity: 0.1; transform: scale(0.9); }
        50%  { opacity: var(--opacity, 0.8); transform: scale(1); }
        100% { opacity: 0.1; transform: scale(0.9); }
      }
      @keyframes star-drift {
        0%   { transform: translate(0, 0); }
        100% { transform: translate(var(--driftX, 0), var(--driftY, 0)); }
      }
    `;
    document.head.appendChild(styleEl);
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      // Position & size
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 3 + 1; // 1px–4px
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      // Colorful (soft pastel)
      const hue = Math.floor(Math.random() * 360);
      star.style.background = `hsla(${hue} 90% 70% / 0.9)`;

      // Existing CSS variables from your code
      star.style.setProperty('--opacity', Math.random() * 0.7 + 0.3);
      star.style.setProperty('--duration', `${(Math.random() * 3 + 2).toFixed(2)}s`);

      // Add gentle drift using CSS variables (small viewport-relative offsets)
      star.style.setProperty('--driftX', `${(Math.random() * 10 - 5).toFixed(2)}vw`);
      star.style.setProperty('--driftY', `${(Math.random() * 10 - 5).toFixed(2)}vh`);

      // Stagger start
      star.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(star);
    }

    return () => {
      document.head.removeChild(styleEl);
      container.innerHTML = '';
    };
  }, []);

  return (
    <div className="about-container">
      <div className="stars-container" ref={starsRef} />
      
      <div className="about-content">
        <div className="about-image-section">
          {data?.image?.url ? (
            <div className="profile-image-wrapper">
              <img 
                src={data.image.url} 
                alt="Profile" 
                className="profile-image" 
              />
            </div>
          ) : (
            <div className="profile-image-wrapper">
              <div className="profile-image" style={{ 
                background: 'linear-gradient(45deg, #1e293b, #334155)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.3)'
              }}>
                No Image
              </div>
            </div>
          )}
        </div>
        
        <div className="about-text-section">
          <h1 className="about-title">About Me</h1>
          <p className="about-description">
            {data?.description || "I'm a passionate developer with expertise in modern web technologies. My journey has taken me through various domains, allowing me to build diverse solutions and collaborate with amazing teams. I specialize in creating responsive, user-friendly applications with clean code and efficient architecture. With several years of experience, I've developed a strong problem-solving ability and a keen eye for detail that helps me deliver high-quality products."}
          </p>
        </div>
      </div>
      
      <ContactMe />
    </div>
  );
}
