import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function ContactSetup() {
  const [f, setF] = useState({
    mobile: "", whatsapp: "", email: "",
    facebook: "", instagram: "", youtube: "", tiktok: "", fbPage: ""
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get("/contact");
    setF({ ...f, ...(data?.data || {}) });
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/contact", f);
      ok("Contact saved");
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  return (
    <section className="grid" style={{ gap: 16 }}>
      <h2>Contact Setup</h2>
      <div className="card grid" style={{ gap: 12 }}>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label>Mobile</label>
            <input value={f.mobile} onChange={(e)=>setF({...f, mobile:e.target.value})} />
          </div>
          <div style={{ flex: 1 }}>
            <label>WhatsApp</label>
            <input value={f.whatsapp} onChange={(e)=>setF({...f, whatsapp:e.target.value})} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Email</label>
            <input type="email" value={f.email} onChange={(e)=>setF({...f, email:e.target.value})} />
          </div>
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label>Facebook</label>
            <input value={f.facebook} onChange={(e)=>setF({...f, facebook:e.target.value})} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Instagram</label>
            <input value={f.instagram} onChange={(e)=>setF({...f, instagram:e.target.value})} />
          </div>
          <div style={{ flex: 1 }}>
            <label>YouTube</label>
            <input value={f.youtube} onChange={(e)=>setF({...f, youtube:e.target.value})} />
          </div>
        </div>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label>TikTok</label>
            <input value={f.tiktok} onChange={(e)=>setF({...f, tiktok:e.target.value})} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Facebook Page</label>
            <input value={f.fbPage} onChange={(e)=>setF({...f, fbPage:e.target.value})} />
          </div>
        </div>
        <button className="btn" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </section>
  );
}
