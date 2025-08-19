import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import UploadImage from "../../components/UploadImage.jsx";
import "./ProjectSetup.css";

export default function ProjectSetup() {
  const [projects, setProjects] = useState([]);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({ name: "", url: "" });
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data?.data || []);
    } catch (e) { err(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleAddProject = async () => {
    if (!file) return err("Please upload a cover image");
    if (!formData.name || !formData.url) return err("Please fill all fields");

    setSaving(true);
    try {
      const form = new FormData();
      form.append("cover", file);
      form.append("name", formData.name);
      form.append("url", formData.url);

      await api.post("/projects", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      ok("Project added successfully!");
      setFile(null);
      setFormData({ name: "", url: "" });
      await loadProjects();
    } catch (e) { err(e); } finally { setSaving(false); }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      ok("Project deleted");
      await loadProjects();
    } catch (e) { err(e); }
  };

  if (isLoading) return <div className="projects-loading-spinner"></div>;

  return (
    <section className="projects-container">
      <h2 className="projects-title">Project Setup</h2>

      <div className="project-form-container">
        <div className="upload-section">
          <UploadImage
            label="Cover Image"
            value={null}
            onChange={setFile}
            onDelete={() => setFile(null)}
          />
        </div>

        <div className="form-section">
          <div className="input-group">
            <label className="input-label">Project Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="project-input"
              placeholder="My Awesome Project"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Project URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="project-input"
              placeholder="https://example.com"
            />
          </div>

          <button
            className="add-project-btn"
            onClick={handleAddProject}
            disabled={saving || !file || !formData.name || !formData.url}
          >
            {saving ? (<><span className="saving-spinner"></span> Adding...</>) : "Add Project"}
          </button>
        </div>
      </div>

      <h3 className="projects-list-title">Project List</h3>

      {projects.length === 0 ? (
        <div className="empty-state">No projects added yet</div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              {project.cover?.url && (
                <div className="project-image-container">
                  <img src={project.cover.url} alt={project.name} className="project-image" />
                  <div className="project-image-overlay"></div>
                </div>
              )}

              <div className="project-details">
                <h4 className="project-name" title={project.name}>{project.name}</h4>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-url"
                  title={project.url}
                >
                  {project.url}
                </a>

                {/* same handler; ensure class name matches CSS */}
                <div className="project-actions">
                  <button
                    className="delete-project-btn"
                    onClick={() => handleDeleteProject(project._id)}
                    aria-label={`Delete ${project.name}`}
                  >
                    Delete Project
                  </button>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
