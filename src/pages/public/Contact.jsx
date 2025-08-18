import { useEffect, useState, useRef } from "react";
import api from "../../api/axiosClient.js";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok
} from "react-icons/fa";
import ContactMe from "../../components/ContactMe.jsx";
import "./Contact.css";

export default function Contact() {
  const [c, setC] = useState({});
  const particlesRef = useRef(null);
  
  useEffect(() => {
    api.get("/contact").then(({ data }) => setC(data?.data || {}));
  }, []);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    
    const particleCount = 100;
    container.innerHTML = '';
    
    const colors = [
      '#4facfe', '#00f2fe', '#ff4e50', '#f9d423', 
      '#a8ff78', '#78ffd6', '#f857a6', '#ff5858'
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'contact-particle';
      
      // Random positioning
      particle.style.left = `${Math.random() * 100}%`;
      // Start relative to the top so every particle crosses the viewport
      particle.style.top = `0`;

      // Random size between 1-4px
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random color
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      // Small horizontal drift per particle (used in keyframes via CSS var)
      particle.style.setProperty('--driftX', `${(Math.random() * 8 - 4).toFixed(2)}vw`);

      // Animation timing
      particle.style.animationDuration = `${(Math.random() * 10 + 10).toFixed(2)}s`; // 10–20s
      particle.style.animationDelay = `${(Math.random() * 2).toFixed(2)}s`;
      
      container.appendChild(particle);
    }
  }, []);

  // Build safe links
  const telHref = c?.mobile
    ? `tel:${String(c.mobile).replace(/[^\d+]/g, "")}`
    : null;

  const waHref = c?.whatsapp
    ? `https://wa.me/${String(c.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(
        "Hello Santosh, I came from your portfolio."
      )}`
    : null;

  const mailHref = c?.email
    ? `mailto:${c.email}?subject=${encodeURIComponent(
        "Portfolio enquiry"
      )}&body=${encodeURIComponent("Hi Santosh,\n\nI saw your portfolio and ...")}`
    : null;

  return (
    <div className="contact-container">
      {/* Animated Particles */}
      <div className="contact-particles" ref={particlesRef} />
      
      {/* Contact Header */}
      <div className="contact-header">
        <h1 className="contact-title">Contact Details</h1>
      </div>
      
      {/* Contact Methods */}
      <div className="contact-grid">
        {telHref ? (
          <div className="contact-card">
            <a href={telHref} aria-label="Call me">
              <FaPhoneAlt />
              <strong>Call Me</strong>
              <p>{c.mobile}</p>
            </a>
          </div>
        ) : (
          <div className="contact-card">
            <FaPhoneAlt />
            <strong>Call Me</strong>
            <p>—</p>
          </div>
        )}

        {waHref ? (
          <div className="contact-card">
            <a href={waHref} target="_blank" rel="noreferrer" aria-label="WhatsApp me">
              <FaWhatsapp />
              <strong>WhatsApp</strong>
              <p>{c.whatsapp}</p>
            </a>
          </div>
        ) : (
          <div className="contact-card">
            <FaWhatsapp />
            <strong>WhatsApp</strong>
            <p>—</p>
          </div>
        )}

        {mailHref ? (
          <div className="contact-card">
            <a href={mailHref} aria-label="Email me">
              <FaEnvelope />
              <strong>Email</strong>
              <p>{c.email}</p>
            </a>
          </div>
        ) : (
          <div className="contact-card">
            <FaEnvelope />
            <strong>Email</strong>
            <p>—</p>
          </div>
        )}
      </div>
      
      {/* Social Media */}
      <div className="social-section">
        <h2 className="social-title">Social Sites</h2>
        <div className="contact-grid">
          {c.facebook && (
            <div className="contact-card">
              <a href={c.facebook} target="_blank" rel="noreferrer">
                <FaFacebook />
                <span>Facebook</span>
              </a>
            </div>
          )}
          {c.instagram && (
            <div className="contact-card">
              <a href={c.instagram} target="_blank" rel="noreferrer">
                <FaInstagram />
                <span>Instagram</span>
              </a>
            </div>
          )}
          {c.youtube && (
            <div className="contact-card">
              <a href={c.youtube} target="_blank" rel="noreferrer">
                <FaYoutube />
                <span>YouTube</span>
              </a>
            </div>
          )}
          {c.tiktok && (
            <div className="contact-card">
              <a href={c.tiktok} target="_blank" rel="noreferrer">
                <FaTiktok />
                <span>TikTok</span>
              </a>
            </div>
          )}
          {c.fbPage && (
            <div className="contact-card">
              <a href={c.fbPage} target="_blank" rel="noreferrer">
                <FaFacebook />
                <span>Facebook Page</span>
              </a>
            </div>
          )}
        </div>
      </div>
      
      <ContactMe />
    </div>
  );
}
