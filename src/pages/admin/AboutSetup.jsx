import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import UploadImage from "../../components/UploadImage.jsx";
import "./AboutSetup.css";

export default function AboutSetup() {
  const [data, setData] = useState({ image: null, description: "" });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/about");
      setData(data?.data || { image: null, description: "" });
    } catch (e) { err(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      const form = new FormData();
      if (file) form.append("image", file);
      form.append("description", data.description || "");
      await api.put("/about", form, { headers: { "Content-Type": "multipart/form-data" } });
      ok("About saved successfully!");
      setFile(null);
      await load();
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  const removeImage = async () => {
    try {
      await api.delete("/about/image");
      ok("Image deleted!");
      await load();
    } catch (e) { err(e); }
  };

  if (isLoading) return <div className="loading-spinner"></div>;

  return (
    <section className="about-setup-container">
      <h2 className="animated-heading">About Setup</h2>
      <div className="about-content-grid">
        <UploadImage 
          label="Profile Image" 
          value={data.image} 
          onChange={setFile} 
          onDelete={removeImage} 
        />
        <div className="description-card">
          <label className="input-label">Description (max 2000 chars)</label>
          <textarea
            className="animated-textarea"
            rows="10"
            value={data.description || ""}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            maxLength="2000"
          />
          <div className="char-count">{data.description?.length || 0}/2000</div>
          <button 
            className="save-btn pulse-on-hover" 
            onClick={save} 
            disabled={saving}
          >
            {saving ? <span className="saving-spinner"></span> : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}