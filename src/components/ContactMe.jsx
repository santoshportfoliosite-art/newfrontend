import { useState } from "react";
import api from "../api/axiosClient.js";
import { ok, err } from "../utils/toast.js";

export default function ContactMe() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/messages", f);
      ok("Message sent!");
      setF({ name: "", email: "", message: "" });
    } catch (e) {
      err(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Contact Me</h3>
      <p className="muted">Fill the form below</p>
      <form onSubmit={submit} className="grid" style={{ gap: 12 }}>
        <div>
          <label>Name</label>
          <input value={f.name} onChange={(e)=>setF({...f, name:e.target.value})} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={f.email} onChange={(e)=>setF({...f, email:e.target.value})} required />
        </div>
        <div>
          <label>Message</label>
          <textarea rows="5" value={f.message} onChange={(e)=>setF({...f, message:e.target.value})} required />
        </div>
        <button className="btn" disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
      </form>
    </div>
  );
}
