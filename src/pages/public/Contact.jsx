import { useEffect, useState } from "react";
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
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function Contact() {
  const [c, setC] = useState({});
  useEffect(() => {
    api.get("/contact").then(({ data }) => setC(data?.data || {}));
  }, []);

  // Build safe links (strip formatting but keep + for tel)
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
    <section className="grid" style={{ gap: 20 }}>
      <h2>Contact Details</h2>

      <div className="grid grid-3">
        {telHref ? (
          <a className="card" href={telHref} aria-label="Call me">
            <FaPhoneAlt />&nbsp;<strong>Call Me:</strong><br />
            {c.mobile}
          </a>
        ) : (
          <div className="card"><FaPhoneAlt />&nbsp;<strong>Call Me:</strong><br />—</div>
        )}

        {waHref ? (
          <a className="card" href={waHref} target="_blank" rel="noreferrer" aria-label="WhatsApp me">
            <FaWhatsapp />&nbsp;<strong>WhatsApp:</strong><br />
            {c.whatsapp}
          </a>
        ) : (
          <div className="card"><FaWhatsapp />&nbsp;<strong>WhatsApp:</strong><br />—</div>
        )}

        {mailHref ? (
          <a className="card" href={mailHref} aria-label="Email me">
            <FaEnvelope />&nbsp;<strong>Email:</strong><br />
            {c.email}
          </a>
        ) : (
          <div className="card"><FaEnvelope />&nbsp;<strong>Email:</strong><br />—</div>
        )}
      </div>

      <h3>Social Sites</h3>
      <div className="grid grid-3">
        {c.facebook && (
          <a className="card" href={c.facebook} target="_blank" rel="noreferrer">
            <FaFacebook />&nbsp;Facebook
          </a>
        )}
        {c.instagram && (
          <a className="card" href={c.instagram} target="_blank" rel="noreferrer">
            <FaInstagram />&nbsp;Instagram
          </a>
        )}
        {c.youtube && (
          <a className="card" href={c.youtube} target="_blank" rel="noreferrer">
            <FaYoutube />&nbsp;YouTube
          </a>
        )}
        {c.tiktok && (
          <a className="card" href={c.tiktok} target="_blank" rel="noreferrer">
            <FaTiktok />&nbsp;TikTok
          </a>
        )}
        {c.fbPage && (
          <a className="card" href={c.fbPage} target="_blank" rel="noreferrer">
            Facebook Page
          </a>
        )}
      </div>

      <ContactMe />
    </section>
  );
}
