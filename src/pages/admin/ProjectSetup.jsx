import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import UploadImage from "../../components/UploadImage.jsx";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function ProjectSetup() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [f, setF] = useState({ name: "", url: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get("/projects");
    setItems(data?.data || []);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!file) return err(new Error("Cover image is required"));
    setSaving(true);
    try {
      const form = new FormData();
      form.append("cover", file);
      form.append("name", f.name);
      form.append("url", f.url);
      await api.post("/projects", form, { headers: { "Content-Type": "multipart/form-data" } });
      ok("Project added");
      setFile(null); setF({ name: "", url: "" });
      await load();
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      ok("Deleted");
      await load();
    } catch (e) { err(e); }
  };

  return (
    <section className="grid" style={{ gap: 16 }}>
      <h2>Project Setup</h2>
      <div className="row">
        <UploadImage label="Cover Image" value={null} onChange={setFile} onDelete={()=>setFile(null)} />
        <div className="card" style={{ flex: 1 }}>
          <div>
            <label>Project Name</label>
            <input value={f.name} onChange={(e)=>setF({...f, name:e.target.value})} />
          </div>
          <div style={{ marginTop: 10 }}>
            <label>Project URL</label>
            <input type="url" value={f.url} onChange={(e)=>setF({...f, url:e.target.value})} />
          </div>
          <button className="btn" style={{ marginTop: 12 }} onClick={add} disabled={saving}>
            {saving ? "Adding..." : "Add Project"}
          </button>
        </div>
      </div>

      <h3 style={{ marginTop: 20 }}>Project List</h3>
      <div className="grid grid-3">
        {items.map(p => (
          <div className="card" key={p._id}>
            {p.cover?.url && <img alt={p.name} src={p.cover.url} style={{ width: "100%", borderRadius: 12, marginBottom: 8 }} />}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><strong>{p.name}</strong><div style={{ color: "var(--muted)", fontSize: 12 }}>{p.url}</div></div>
              <button className="btn outline" onClick={() => del(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
