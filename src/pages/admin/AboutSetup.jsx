import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import UploadImage from "../../components/UploadImage.jsx";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function AboutSetup() {
  const [data, setData] = useState({ image: null, description: "" });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get("/about");
    setData(data?.data || { image: null, description: "" });
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const form = new FormData();
      if (file) form.append("image", file);
      form.append("description", data.description || "");
      await api.put("/about", form, { headers: { "Content-Type": "multipart/form-data" } });
      ok("About saved");
      setFile(null);
      await load();
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  const removeImage = async () => {
    try {
      await api.delete("/about/image");
      ok("Image deleted");
      await load();
    } catch (e) { err(e); }
  };

  return (
    <section className="grid" style={{ gap: 16 }}>
      <h2>About Setup</h2>
      <div className="row">
        <UploadImage label="Profile Image" value={data.image} onChange={setFile} onDelete={removeImage} />
        <div className="card" style={{ flex: 1 }}>
          <label>Description (max 2000)</label>
          <textarea rows="10" value={data.description || ""} onChange={(e)=>setData({...data, description:e.target.value})} />
          <button className="btn" style={{ marginTop: 12 }} onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </section>
  );
}
