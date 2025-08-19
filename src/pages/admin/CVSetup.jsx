import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import "./cvsetup.css";

export default function CVSetup() {
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/cv");
      setUrl(data?.data?.url || "");
    } catch (e) { err(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/cv", { url });
      ok("CV link saved successfully!");
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  if (isLoading) return <div className="cv-loading-spinner"></div>;

  return (
    <section className="cv-setup-container">
      <h2 className="cv-title">CV Link Setup</h2>
      
      <div className="cv-card">
        <div className="input-group">
          <label className="cv-label">CV URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="cv-input"
          />
          <div className="input-border"></div>
        </div>
        
        <button 
          className="cv-save-btn" 
          onClick={save} 
          disabled={saving || !url}
        >
          {saving ? (
            <>
              <span className="cv-saving-spinner"></span> Saving...
            </>
          ) : "Save CV Link"}
        </button>
      </div>
    </section>
  );
}