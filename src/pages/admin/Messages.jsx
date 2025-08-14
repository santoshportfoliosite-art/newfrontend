import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import Modal from "../../components/Modal.jsx";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function Messages() {
  const [unread, setUnread] = useState([]);
  const [read, setRead] = useState([]);
  const [view, setView] = useState(null);

  const load = async () => {
    const [u, r] = await Promise.all([
      api.get("/messages", { params: { status: "unread" } }),
      api.get("/messages", { params: { status: "read" } })
    ]);
    setUnread(u?.data?.data?.items || []);
    setRead(r?.data?.data?.items || []);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`);
      ok("Marked as read");
      await load();
    } catch (e) { err(e); }
  };

  const openView = async (id) => {
    try {
      const { data } = await api.get(`/messages/${id}`);
      setView(data?.data || null);
    } catch (e) { err(e); }
  };

  return (
    <section className="grid" style={{ gap: 16 }}>
      <h2>Messages</h2>

      <div className="card">
        <h3>Unread Messages</h3>
        {unread.length === 0 && <div style={{ color: "var(--muted)" }}>No unread messages</div>}
        {unread.map(m => (
          <div key={m._id} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "8px 0" }}>
            <div>{m.name} — <span style={{ color: "var(--muted)" }}>{m.email}</span></div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn outline" onClick={() => openView(m._id)}>View</button>
              <button className="btn" onClick={() => markRead(m._id)}>Mark as read</button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Seen Messages</h3>
        {read.length === 0 && <div style={{ color: "var(--muted)" }}>No read messages</div>}
        {read.map(m => (
          <div key={m._id} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "8px 0" }}>
            <div>{m.name} — <span style={{ color: "var(--muted)" }}>{m.email}</span></div>
            <div>
              <button className="btn outline" onClick={() => openView(m._id)}>View</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!view} onClose={() => setView(null)} title={view?.name}>
        <div style={{ color: "var(--muted)" }}>
          <div><strong>Email:</strong> {view?.email}</div>
          <div style={{ marginTop: 12 }}><strong>Message</strong></div>
          <p>{view?.message}</p>
        </div>
      </Modal>
    </section>
  );
}
