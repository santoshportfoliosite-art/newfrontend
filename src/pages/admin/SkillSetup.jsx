import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import UploadImage from "../../components/UploadImage.jsx";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function SkillSetup() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get("/skills");
    setItems(data?.data || []);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!file) return err(new Error("Cover image is required"));
    if (!title) return err(new Error("Title is required"));
    setSaving(true);
    try {
      const form = new FormData();
      form.append("cover", file);
      form.append("title", title);
      await api.post("/skills", form, { headers: { "Content-Type": "multipart/form-data" } });
      ok("Skill added");
      setFile(null); setTitle("");
      await load();
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      ok("Deleted");
      await load();
    } catch (e) { err(e); }
  };

  return (
    <section className="grid" style={{ gap: 16 }}>
      <h2>Skill Setup</h2>
      <div className="row">
        <UploadImage label="Cover Image" value={null} onChange={setFile} onDelete={()=>setFile(null)} />
        <div className="card" style={{ flex: 1 }}>
          <label>Skill Title</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} />
          <button className="btn" style={{ marginTop: 12 }} onClick={add} disabled={saving}>
            {saving ? "Adding..." : "Add Skill"}
          </button>
        </div>
      </div>

      <h3 style={{ marginTop: 20 }}>Skills List</h3>
      <div className="grid grid-3">
        {items.map(s => (
          <div className="card" key={s._id}>
            {s.cover?.url && <img alt={s.title} src={s.cover.url} style={{ width: "100%", borderRadius: 12, marginBottom: 8 }} />}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{s.title}</strong>
              <button className="btn outline" onClick={() => del(s._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
