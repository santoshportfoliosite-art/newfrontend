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

    // Create stars (CSS provides keyframes)
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

      // Twinkle intensity & duration
      star.style.setProperty('--opacity', (Math.random() * 0.7 + 0.3).toFixed(2));
      star.style.setProperty('--duration', `${(Math.random() * 3 + 2).toFixed(2)}s`);

      // Gentle drift using viewport-relative offsets
      star.style.setProperty('--driftX', `${(Math.random() * 10 - 5).toFixed(2)}vw`);
      star.style.setProperty('--driftY', `${(Math.random() * 10 - 5).toFixed(2)}vh`);

      // Staggered start
      star.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;

      container.appendChild(star);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div className="about-container">
      {/* Full-screen stars */}
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
          <h1 className="about-title heading-shimmer heading-underline">About Me</h1>
          <p className="about-description">
            {data?.description || "I'm a passionate developer with expertise in modern web technologies. My journey has taken me through various domains, allowing me to build diverse solutions and collaborate with amazing teams. I specialize in creating responsive, user-friendly applications with clean code and efficient architecture. With several years of experience, I've developed a strong problem-solving ability and a keen eye for detail that helps me deliver high-quality products."}
          </p>

          
        </div>
      </div>
      
    </div>
  );
}
