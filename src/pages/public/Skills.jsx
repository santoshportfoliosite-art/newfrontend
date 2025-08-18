import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosClient.js";
import ContactMe from "../../components/ContactMe.jsx";
import "./Skills.css";

export default function Skills() {
  const [items, setItems] = useState([]);
  const skillsRef = useRef(null);
  
  useEffect(() => { 
    api.get("/skills").then(({data}) => setItems(data?.data || [])); 
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate progress bars
            const progressBar = entry.target.querySelector('.skill-progress-bar');
            if (progressBar) {
              const level = entry.target.dataset.level || 80;
              progressBar.style.width = `${level}%`;
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (skillsRef.current) {
      const cards = skillsRef.current.querySelectorAll('.skill-card');
      cards.forEach(card => {
        observer.observe(card);
        // Add random level between 70-100% for demo
        card.dataset.level = Math.floor(Math.random() * 30) + 70;
      });
    }

    return () => observer.disconnect();
  }, [items]);

  return (
    <section className="skills-container">
      {/* Animated Background Elements */}
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
      
      <ContactMe />
    </section>
  );
}