export default function Modal({ open, onClose, children, title }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      display: "grid", placeItems: "center", zIndex: 1000
    }}>
      <div className="card" style={{ width: "min(720px, 92vw)", maxHeight: "85vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{title || "Details"}</h3>
          <button className="btn outline" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
