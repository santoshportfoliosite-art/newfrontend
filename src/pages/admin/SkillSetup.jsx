import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import UploadImage from "../../components/UploadImage.jsx";
import "./SkillSetup.css";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";

export default function SkillSetup() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/skills");
      setItems(data?.data || []);
    } catch (error) {
      err(error);
    }
  };

  useEffect(() => { load(); }, []);

  const addSkill = async () => {
    if (!file) return err(new Error("Cover image is required"));
    if (!title.trim()) return err(new Error("Title is required"));
    
    setSaving(true);
    try {
      const form = new FormData();
      form.append("cover", file);
      form.append("title", title.trim());
      await api.post("/skills", form, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
      ok("Skill added successfully! 🎯");
      setFile(null); 
      setTitle("");
      await load();
    } catch (error) { 
      err(error); 
    } finally { 
      setSaving(false); 
    }
  };

  const deleteSkill = async (id) => {
    if (!confirm("Are you sure you want to delete this skill? This action cannot be undone.")) return;
    try {
      await api.delete(`/skills/${id}`);
      ok("Skill deleted successfully");
      await load();
    } catch (error) { 
      err(error); 
    }
  };

  return (
    <section className="skill-setup">
      <h2 className="skill-title">Skill Setup</h2>
      
      <div className="skill-form-row">
        <UploadImage 
          label="Skill Icon/Image" 
          value={null} 
          onChange={setFile} 
          onDelete={() => setFile(null)} 
        />
        
        <div className="skill-form-card">
          <div className="form-group">
            <label className="form-label">Skill Title</label>
            <input
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter skill name (e.g., React, Node.js, Photoshop)"
              disabled={saving}
            />
          </div>
          
          <button 
            className="btn submit-btn" 
            onClick={addSkill} 
            disabled={saving}
          >
            {saving ? "Adding Skill..." : "➕ Add Skill"}
          </button>
        </div>
      </div>

      <h3 className="skill-list-title">Skills List</h3>
      
      <div className="skills-grid">
        {items.map(skill => (
          <div className="skill-card" key={skill._id}>
            {skill.cover?.url && (
              <img 
                className="skill-image" 
                alt={skill.title} 
                src={skill.cover.url} 
              />
            )}
            
            <div className="skill-info">
              <span className="skill-name">{skill.title}</span>
              <button 
                className="btn outline delete-btn" 
                onClick={() => deleteSkill(skill._id)}
                disabled={saving}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}