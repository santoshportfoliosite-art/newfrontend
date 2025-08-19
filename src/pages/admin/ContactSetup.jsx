import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import "./ContactSetup.css";

export default function ContactSetup() {
  const [contactData, setContactData] = useState({
    mobile: "", whatsapp: "", email: "",
    facebook: "", instagram: "", youtube: "", tiktok: "", fbPage: ""
  });
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/contact");
      setContactData(prev => ({ ...prev, ...(data?.data || {}) }));
    } catch (e) { err(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put("/contact", contactData);
      ok("Contact details saved successfully!");
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  const handleInputChange = (e, field) => {
    setContactData({ ...contactData, [field]: e.target.value });
  };

  if (isLoading) return <div className="loading-spinner"></div>;

  return (
    <section className="contact-setup-container">
      <h2 className="glowing-heading">Contact Setup</h2>
      
      <div className="contact-form-card">
        <div className="input-grid">
          {/* Row 1 */}
          <div className="input-group">
            <label className="input-label">Mobile</label>
            <input 
              type="tel"
              value={contactData.mobile}
              onChange={(e) => handleInputChange(e, 'mobile')}
              className="glowing-input"
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">WhatsApp</label>
            <input 
              type="tel"
              value={contactData.whatsapp}
              onChange={(e) => handleInputChange(e, 'whatsapp')}
              className="glowing-input"
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Email</label>
            <input 
              type="email"
              value={contactData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              className="glowing-input"
            />
          </div>
          
          {/* Row 2 */}
          <div className="input-group">
            <label className="input-label">Facebook</label>
            <input 
              value={contactData.facebook}
              onChange={(e) => handleInputChange(e, 'facebook')}
              className="glowing-input"
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Instagram</label>
            <input 
              value={contactData.instagram}
              onChange={(e) => handleInputChange(e, 'instagram')}
              className="glowing-input"
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">YouTube</label>
            <input 
              value={contactData.youtube}
              onChange={(e) => handleInputChange(e, 'youtube')}
              className="glowing-input"
            />
          </div>
          
          {/* Row 3 */}
          <div className="input-group">
            <label className="input-label">TikTok</label>
            <input 
              value={contactData.tiktok}
              onChange={(e) => handleInputChange(e, 'tiktok')}
              className="glowing-input"
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Facebook Page</label>
            <input 
              value={contactData.fbPage}
              onChange={(e) => handleInputChange(e, 'fbPage')}
              className="glowing-input"
            />
          </div>
        </div>
        
        <button 
          className="save-btn neon-btn" 
          onClick={save} 
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="saving-spinner"></span> Saving...
            </>
          ) : "Save Changes"}
        </button>
      </div>
    </section>
  );
}