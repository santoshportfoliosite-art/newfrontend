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
  const contactRef = useRef(null);
  const socialRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    api.get("/contact").then(({ data }) => setC(data?.data || {}));
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
      const p = document.createElement("div");
      p.className = "contact-particle";
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


  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );

    if (contactRef.current) {
      contactRef.current
        .querySelectorAll(".contact-card")
        .forEach(card => observer.observe(card));
    }

    if (socialRef.current) {
      socialRef.current
        .querySelectorAll(".contact-card")
        .forEach(card => observer.observe(card));
    }

    return () => observer.disconnect();
  }, [c]);


  const normalizeUrl = (u) => {
    if (!u || typeof u !== "string") return null;
    const trimmed = u.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;

    return `https://${trimmed}`;
  };


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


  const socialLinks = [
    { key: "facebook", icon: <FaFacebook />, label: "Facebook", href: normalizeUrl(c?.facebook || c?.fb || c?.fbPage) },
    { key: "instagram", icon: <FaInstagram />, label: "Instagram", href: normalizeUrl(c?.instagram) },
    { key: "youtube", icon: <FaYoutube />, label: "YouTube", href: normalizeUrl(c?.youtube) },
    { key: "tiktok", icon: <FaTiktok />, label: "TikTok", href: normalizeUrl(c?.tiktok) },

    ...(c?.fbPage && normalizeUrl(c.fbPage) && normalizeUrl(c.fbPage) !== normalizeUrl(c.facebook)
      ? [{ key: "fbPage", icon: <FaFacebook />, label: "Facebook Page", href: normalizeUrl(c.fbPage) }]
      : [])
  ].filter(s => !!s.href); 

  return (
    <section className="contact-container">

      <div className="contact-particles" ref={particlesRef} />


      <div className="contact-bg-element"></div>
      <div className="contact-bg-element"></div>
      

      <div className="contact-header">
        <h1 className="contact-title">Contact Details</h1>
      </div>
      

      <div className="contact-grid" ref={contactRef}>
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
      
   
      <div className="social-section">
        <h2 className="social-title">Social Sites</h2>
        <div className="contact-grid" ref={socialRef}>
          {socialLinks.length > 0 ? (
            socialLinks.map(s => (
              <div key={s.key} className="contact-card">
                <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                  {s.icon}
                  <span>{s.label}</span>
                </a>
              </div>
            ))
          ) : (
            <>
              <div className="contact-card"><FaFacebook /><span>Facebook</span><p>—</p></div>
              <div className="contact-card"><FaInstagram /><span>Instagram</span><p>—</p></div>
              <div className="contact-card"><FaYoutube /><span>YouTube</span><p>—</p></div>
              <div className="contact-card"><FaTiktok /><span>TikTok</span><p>—</p></div>
            </>
          )}
        </div>
      </div>
      <div className="contactmediv"> <ContactMe /></div>
     
    </section>
  );
}
