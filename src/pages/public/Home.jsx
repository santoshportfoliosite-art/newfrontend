import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axiosClient.js";
import Counter from "../../components/Counter.jsx";
import ContactMe from "../../components/ContactMe.jsx";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok
} from "react-icons/fa";

const ROLES = ["Developer", "Designer", "Programmer","Editor"];

export default function Home() {
  const [about, setAbout] = useState(null);
  const [cv, setCv] = useState("");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [contact, setContact] = useState({});

  // rotate role text
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

  // ---- Build clickable links for contact cards (same logic as Contact page)
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
    <section className="grid" style={{ gap: 28 }}>
      {/* Hero */}
      <div className="row">
        {/* Left */}
        <motion.div
          className="card"
          style={{ flex: 1 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={{ marginBottom: 8 }}>
            I am{" "}
            <span style={{ color: "var(--brand)" }}>{role}</span>
            {" "}
          </h1>
          <h2 style={{ marginTop: 6 }}>SANTOSH <span style={{ color: "var(--brand)" }}>&nbsp;THAPA</span></h2>
          <p style={{ color: "var(--muted)" }}>
            A passionate Developer.{" "}
            {about?.description ? about.description.slice(0, 200) : "Crafting delightful, performant web experiences."}
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
            {hasCV ? (
              <a
                className="btn"
                href={cv}
                target="_blank"
                rel="noreferrer"
                download
                title="Download CV"
              >
                Download CV
              </a>
            ) : (
              <button className="btn" disabled title="Add CV link in Dashboard → CV Link Setup">
                Download CV
              </button>
            )}
            <a className="btn outline" href="/projects" title="See all projects">
              Projects Completed:&nbsp;<Counter to={projects.length} />
            </a>
          </div>
        </motion.div>

        {/* Right (image) */}
        <motion.div
          className="card"
          style={{ width: 380, display: "grid", placeItems: "center" }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          {about?.image?.url ? (
            <motion.img
              src={about.image.url}
              alt="Profile"
              style={{ width: "100%", borderRadius: 12 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            />
          ) : (
            <div style={{ height: 260, color: "var(--muted)" }}>No image</div>
          )}
        </motion.div>
      </div>

      {/* --- Projects section (Home view) --- */}
      <motion.section
        className="grid"
        style={{ gap: 16 }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.35 }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>My Amazing Projects</h2>
          <span className="card">Completed: <Counter to={projects.length} /></span>
        </div>
        <div className="grid grid-3">
          {projects.map((p) => (
            <a key={p._id} className="card" href={p.url} target="_blank" rel="noreferrer">
              {p.cover?.url && (
                <img
                  src={p.cover.url}
                  alt={p.name}
                  style={{ width: "100%", borderRadius: 12, marginBottom: 8 }}
                />
              )}
              <strong>{p.name}</strong>
            </a>
          ))}
          {projects.length === 0 && (
            <div className="card" style={{ color: "var(--muted)" }}>
              No projects yet. Add some in Dashboard → Project Setup.
            </div>
          )}
        </div>
      </motion.section>

      {/* --- Skills section (Home view) --- */}
      <motion.section
        className="grid"
        style={{ gap: 16 }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.35 }}
      >
        <h2>My Skills</h2>
        <div className="grid grid-3">
          {skills.map((s) => (
            <div className="card" key={s._id}>
              {s.cover?.url && (
                <img
                  src={s.cover.url}
                  alt={s.title}
                  style={{ width: "100%", borderRadius: 12, marginBottom: 8 }}
                />
              )}
              <strong>{s.title}</strong>
            </div>
          ))}
          {skills.length === 0 && (
            <div className="card" style={{ color: "var(--muted)" }}>
              No skills yet. Add some in Dashboard → Skill Setup.
            </div>
          )}
        </div>
      </motion.section>

      {/* --- About section (Home view) --- */}
      <motion.section
        className="grid"
        style={{ gap: 16 }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.35 }}
      >
        <h2>About Me</h2>
        <div className="row">
          <div className="card" style={{ width: 380 }}>
            {about?.image?.url ? (
              <img src={about.image.url} alt="About" style={{ width: "100%", borderRadius: 12 }} />
            ) : (
              <div style={{ height: 220 }} />
            )}
          </div>
          <div className="card" style={{ flex: 1 }}>
            <p style={{ color: "var(--muted)" }}>{about?.description || "—"}</p>
          </div>
        </div>
      </motion.section>

      {/* --- Contact section (Home view) with clickable cards --- */}
      <motion.section
        className="grid"
        style={{ gap: 16 }}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.35 }}
      >
        <h2>Contact Details</h2>
        <div className="grid grid-3">
          {telHref ? (
            <a className="card" href={telHref} aria-label="Call me">
              <FaPhoneAlt />&nbsp;<strong>Call Me:</strong><br />
              {contact.mobile}
            </a>
          ) : (
            <div className="card"><FaPhoneAlt />&nbsp;<strong>Call Me:</strong><br />—</div>
          )}

          {waHref ? (
            <a className="card" href={waHref} target="_blank" rel="noreferrer" aria-label="WhatsApp me">
              <FaWhatsapp />&nbsp;<strong>WhatsApp:</strong><br />
              {contact.whatsapp}
            </a>
          ) : (
            <div className="card"><FaWhatsapp />&nbsp;<strong>WhatsApp:</strong><br />—</div>
          )}

          {mailHref ? (
            <a className="card" href={mailHref} aria-label="Email me">
              <FaEnvelope />&nbsp;<strong>Email:</strong><br />
              {contact.email}
            </a>
          ) : (
            <div className="card"><FaEnvelope />&nbsp;<strong>Email:</strong><br />—</div>
          )}
        </div>

        <h3>Social Sites</h3>
        <div className="grid grid-3">
          {contact.facebook && (
            <a className="card" href={contact.facebook} target="_blank" rel="noreferrer">
              <FaFacebook />&nbsp;Facebook
            </a>
          )}
          {contact.instagram && (
            <a className="card" href={contact.instagram} target="_blank" rel="noreferrer">
              <FaInstagram />&nbsp;Instagram
            </a>
          )}
          {contact.youtube && (
            <a className="card" href={contact.youtube} target="_blank" rel="noreferrer">
              <FaYoutube />&nbsp;YouTube
            </a>
          )}
          {contact.tiktok && (
            <a className="card" href={contact.tiktok} target="_blank" rel="noreferrer">
              <FaTiktok />&nbsp;TikTok
            </a>
          )}
          {contact.fbPage && (
            <a className="card" href={contact.fbPage} target="_blank" rel="noreferrer">
              Facebook Page
            </a>
          )}
        </div>
      </motion.section>

      {/* Single ContactMe component at the end */}
      <ContactMe />
    </section>
  );
}
