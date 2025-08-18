import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axiosClient.js";
import Counter from "../../components/Counter.jsx";
import ContactMe from "../../components/ContactMe.jsx";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok
} from "react-icons/fa";
import "./Home.css";
import About from "./About.jsx";
import Projects from "./Projects.jsx";
import Skills from "./Skills.jsx";
import Education from "./Education.jsx";
import Contact from "./Contact.jsx";

const ROLES = ["Developer", "Designer", "Programmer", "Editor"];

export default function Home() {
  const [about, setAbout] = useState(null);
  const [cv, setCv] = useState("");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contact, setContact] = useState({});

  // Rotate role text
  const [roleIndex, setRoleIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 1800);
    return () => clearInterval(id);
  }, []);
  const role = useMemo(() => ROLES[roleIndex], [roleIndex]);

  useEffect(() => {
    (async () => {
      const [a, c, p, s, ct] = await Promise.all([
        api.get("/about").catch(() => null),
        api.get("/cv").catch(() => null),
        api.get("/projects").catch(() => null),
        api.get("/skills").catch(() => null),
        api.get("/contact").catch(() => null)
      ]);
      setAbout(a?.data?.data || null);
      setCv(c?.data?.data?.url || "");
      setProjects(p?.data?.data || []);
      setSkills(s?.data?.data || []);
      setContact(ct?.data?.data || {});
    })();
  }, []);

  const hasCV = Boolean(cv);

  // Contact links
  const telHref = contact?.mobile
    ? `tel:${String(contact.mobile).replace(/[^\d+]/g, "")}`
    : null;

  const waHref = contact?.whatsapp
    ? `https://wa.me/${String(contact.whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(
        "Hello Santosh, I came from your portfolio."
      )}`
    : null;

  const mailHref = contact?.email
    ? `mailto:${contact.email}?subject=${encodeURIComponent(
        "Portfolio enquiry"
      )}&body=${encodeURIComponent("Hi Santosh,\n\nI saw your portfolio and ...")}`
    : null;

  return (
    <div className="home-container">
      {/* Animated Background Elements */}
      <div className="home-bg-element"></div>
      <div className="home-bg-element"></div>

      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            I am <span className="role-text">{role}</span>
          </h1>
          <h1 className="hero-title">SANTOSH <span style={{ color: "var(--brand)" }}>THAPA</span></h1>
          <p className="hero-description">
            {about?.description ? about.description.slice(0, 200) : "Crafting delightful, performant web experiences."}
          </p>
          <div className="hero-actions">
            {hasCV ? (
              <motion.a
                className="btn"
                href={cv}
                target="_blank"
                rel="noreferrer"
                download
                title="Download CV"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download CV
              </motion.a>
            ) : (
              <motion.button 
                className="btn" 
                disabled 
                title="Add CV link in Dashboard → CV Link Setup"
                whileHover={{ scale: 1.05 }}
              >
                Download CV
              </motion.button>
            )}
            
          </div>
        </div>

       
      </motion.section>

      
     <About/>
     <Projects/>
     <Skills/>
     <Education/>
            
      <Contact />
    </div>
  );
}