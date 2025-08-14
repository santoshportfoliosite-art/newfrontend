import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function CVSetup() {
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get("/cv");
    setUrl(data?.data?.url || "");
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/cv", { url });
      ok("CV link saved");
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  return (
    <section className="grid" style={{ gap: 16 }}>
      <h2>CV Link Setup</h2>
      <div className="card">
        <label>CV URL</label>
        <input type="url" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="https://..." />
        <button className="btn" style={{ marginTop: 12 }} onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </section>
  );
}
