import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import ContactMe from "../../components/ContactMe.jsx";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function Education() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/education").then(({data}) => setItems(data?.data || [])); }, []);
  return (
    <section className="grid" style={{ gap: 20 }}>
      <h2>My Education</h2>
      <div className="grid">
        {items.map((e) => (
          <div key={e._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><strong>{e.level}</strong><div style={{ color: "var(--muted)" }}>{e.institution}</div></div>
            <div>{e.year}</div>
          </div>
        ))}
      </div>
      <ContactMe />
    </section>
  );
}
