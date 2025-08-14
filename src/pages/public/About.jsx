import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import ContactMe from "../../components/ContactMe.jsx";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function About() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/about").then(({data}) => setData(data?.data || null)); }, []);
  return (
    <section className="grid" style={{ gap: 20 }}>
      <h2>About Me</h2>
      <div className="row">
        <div className="card" style={{ width: 380 }}>
          {data?.image?.url ? <img src={data.image.url} alt="about" style={{ width: "100%", borderRadius: 12 }} /> : <div style={{ height: 220 }} />}
        </div>
        <div className="card" style={{ flex: 1 }}>
          <p style={{ color: "var(--muted)" }}>{data?.description || "—"}</p>
        </div>
      </div>
      <ContactMe />
    </section>
  );
}
