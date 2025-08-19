import { useEffect, useState } from "react";
import api from "../../api/axiosClient.js";
import { ok, err } from "../../utils/toast.js";
import Modal from "../../components/Modal.jsx";
import "./Messages.css";

export default function Messages() {
  const [unread, setUnread] = useState([]);
  const [read, setRead] = useState([]);
  const [view, setView] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const [u, r] = await Promise.all([
        api.get("/messages", { params: { status: "unread" } }),
        api.get("/messages", { params: { status: "read" } })
      ]);
      setUnread(u?.data?.data?.items || []);
      setRead(r?.data?.data?.items || []);
    } catch (e) { err(e); } finally { setLoading(false); }
  };

  useEffect(() => { loadMessages(); }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/messages/${id}/read`);
      ok("Marked as read");
      await loadMessages();
    } catch (e) { err(e); }
  };

  const openMessage = async (id) => {
    try {
      const { data } = await api.get(`/messages/${id}`);
      setView(data?.data || null);
    } catch (e) { err(e); }
  };

  if (loading) return <div className="messages-loading-spinner"></div>;

  return (
    <section className="messages-container">
      <h2 className="messages-title">Messages</h2>

      <div className="messages-section">
        <div className="messages-card unread">
          <div className="card-header">
            <h3>Unread Messages</h3>
            <span className="badge">{unread.length}</span>
          </div>
          
          {unread.length === 0 ? (
            <div className="empty-state">No unread messages</div>
          ) : (
            <div className="messages-list">
              {unread.map(message => (
                <div key={message._id} className="message-item">
                  <div className="message-info">
                    <div className="message-sender">
                      {message.name} <span className="message-email">{message.email}</span>
                    </div>
                    <div className="message-preview">{message.message.substring(0, 60)}...</div>
                  </div>
                  <div className="message-actions">
                    <button 
                      className="view-btn"
                      onClick={() => openMessage(message._id)}
                    >
                      View
                    </button>
                    <button 
                      className="mark-read-btn"
                      onClick={() => markAsRead(message._id)}
                    >
                      Mark Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="messages-card read">
          <div className="card-header">
            <h3>Read Messages</h3>
            <span className="badge">{read.length}</span>
          </div>
          
          {read.length === 0 ? (
            <div className="empty-state">No read messages</div>
          ) : (
            <div className="messages-list">
              {read.map(message => (
                <div key={message._id} className="message-item">
                  <div className="message-info">
                    <div className="message-sender">
                      {message.name} <span className="message-email">{message.email}</span>
                    </div>
                    <div className="message-preview">{message.message.substring(0, 60)}...</div>
                  </div>
                  <div className="message-actions">
                    <button 
                      className="view-btn"
                      onClick={() => openMessage(message._id)}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={!!view} onClose={() => setView(null)} title={view?.name}>
        <div className="message-detail">
          <div className="detail-row">
            <strong>Email:</strong> 
            <a href={`mailto:${view?.email}`} className="email-link">{view?.email}</a>
          </div>
          <div className="detail-row">
            <strong>Date:</strong> 
            <span>{new Date(view?.createdAt).toLocaleString()}</span>
          </div>
          <div className="message-content">
            <p>{view?.message}</p>
          </div>
          {!view?.read && (
            <button 
              className="mark-read-btn modal-btn"
              onClick={() => {
                markAsRead(view._id);
                setView(null);
              }}
            >
              Mark as Read
            </button>
          )}
        </div>
      </Modal>
    </section>
  );
}