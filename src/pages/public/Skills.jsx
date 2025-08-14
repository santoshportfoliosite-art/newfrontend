import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import ContactMe from "../../components/ContactMe.jsx";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";

export default function Skills() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/skills").then(({data}) => setItems(data?.data || [])); }, []);
  return (
    <section className="grid" style={{ gap: 20 }}>
      <h2>My Skills</h2>
      <div className="grid grid-3">
        {items.map(s => (
          <div key={s._id} className="card">
            {s.cover?.url && <img src={s.cover.url} alt={s.title} style={{ width: "100%", borderRadius: 12, marginBottom: 8 }} />}
            <strong>{s.title}</strong>
          </div>
        ))}
      </div>
      <ContactMe />
    </section>
  );
}
