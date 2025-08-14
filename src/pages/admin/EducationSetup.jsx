import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function EducationSetup() {
  const [items, setItems] = useState([]);
  const [f, setF] = useState({ level: "", institution: "", year: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get("/education");
    setItems(data?.data || []);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!f.level || !f.institution || !f.year) return;
    setSaving(true);
    try {
      await api.post("/education", { level: f.level, institution: f.institution, year: Number(f.year) });
      ok("Education added");
      setF({ level: "", institution: "", year: "" });
      await load();
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await api.delete(`/education/${id}`);
      ok("Deleted");
      await load();
    } catch (e) { err(e); }
  };

  return (
    <section className="grid" style={{ gap: 16 }}>
      <h2>Education Setup</h2>
      <div className="card">
        <div className="row">
          <div style={{ flex: 1 }}>
            <label>Level</label>
            <input value={f.level} onChange={(e)=>setF({...f, level:e.target.value})} />
          </div>
          <div style={{ flex: 2 }}>
            <label>Institution Name</label>
            <input value={f.institution} onChange={(e)=>setF({...f, institution:e.target.value})} />
          </div>
          <div style={{ width: 140 }}>
            <label>Year Passout</label>
            <input value={f.year} onChange={(e)=>setF({...f, year:e.target.value})} placeholder="2023" />
          </div>
        </div>
        <button className="btn" style={{ marginTop: 12 }} onClick={add} disabled={saving}>
          {saving ? "Adding..." : "Add"}
        </button>
      </div>

      <h3 style={{ marginTop: 20 }}>Education History</h3>
      <div className="grid">
        {items.map((e, idx) => (
          <div key={e._id} className="card" style={{ display: "grid", gridTemplateColumns: "50px 1fr 1fr 120px", gap: 10, alignItems: "center" }}>
            <div>{idx + 1}</div>
            <div>{e.level}</div>
            <div>{e.institution}</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "end", alignItems: "center" }}>
              <span>{e.year}</span>
              <button className="btn outline" onClick={() => del(e._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
