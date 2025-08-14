import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import Counter from "../../components/Counter.jsx";
import ContactMe from "../../components/ContactMe.jsx";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function Projects() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/projects").then(({data}) => setItems(data?.data || [])); }, []);
  return (
    <section className="grid" style={{ gap: 20 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>My Amazing Projects</h2>
        <span className="card">Completed: <Counter to={items.length} /></span>
      </div>
      <div className="grid grid-3">
        {items.map(p => (
          <a key={p._id} className="card" href={p.url} target="_blank" rel="noreferrer">
            {p.cover?.url && <img src={p.cover.url} alt={p.name} style={{ width: "100%", borderRadius: 12, marginBottom: 8 }} />}
            <strong>{p.name}</strong>
          </a>
        ))}
      </div>
      <ContactMe />
    </section>
  );
}
