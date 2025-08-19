import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import "./EducationSetup.css";

export default function EducationSetup() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ 
    level: "", 
    institution: "", 
    year: "" 
  });
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get("/education");
      setItems(data?.data || []);
    } catch (e) { err(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!formData.level || !formData.institution || !formData.year) {
      err("Please fill all fields");
      return;
    }
    
    setSaving(true);
    try {
      await api.post("/education", { 
        level: formData.level, 
        institution: formData.institution, 
        year: Number(formData.year) 
      });
      ok("Education added successfully!");
      setFormData({ level: "", institution: "", year: "" });
      await load();
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) return;
    try {
      await api.delete(`/education/${id}`);
      ok("Education deleted");
      await load();
    } catch (e) { err(e); }
  };

  if (isLoading) return <div className="education-loading-spinner"></div>;

  return (
    <section className="education-setup-container">
      <h2 className="education-title">Education Setup</h2>
      
      <div className="education-form-card">
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label">Level</label>
            <input
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
              className="education-input"
              placeholder="e.g. Bachelor's Degree"
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Institution Name</label>
            <input
              value={formData.institution}
              onChange={(e) => setFormData({...formData, institution: e.target.value})}
              className="education-input"
              placeholder="e.g. Harvard University"
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Year Passout</label>
            <input
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              className="education-input"
              placeholder="2023"
              type="number"
            />
          </div>
        </div>
        
        <button 
          className="add-btn" 
          onClick={handleAdd} 
          disabled={saving || !formData.level || !formData.institution || !formData.year}
        >
          {saving ? (
            <>
              <span className="saving-spinner"></span> Adding...
            </>
          ) : "Add Education"}
        </button>
      </div>

      <h3 className="history-title">Education History</h3>
      
      <div className="education-list">
        {items.length === 0 ? (
          <div className="empty-state">No education entries yet</div>
        ) : (
          items.map((item, index) => (
            <div key={item._id} className="education-item">
              <div className="item-index">{index + 1}</div>
              <div className="item-level">{item.level}</div>
              <div className="item-institution">{item.institution}</div>
              <div className="item-year">{item.year}</div>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}