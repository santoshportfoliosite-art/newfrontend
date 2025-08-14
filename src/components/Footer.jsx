export default function Footer() {
  return (
    <footer style={{ padding: 24, marginTop: 40, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <small style={{ color: "var(--muted)" }}>© {new Date().getFullYear()} Santosh Thapa</small>
        <small style={{ color: "var(--muted)" }}>Portfolio</small>
      </div>
    </footer>
  );
}
