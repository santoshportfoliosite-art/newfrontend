import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminLayout() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const doLogout = async () => {
    await logout();
    nav("/admin/login", { replace: true });
  };
  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(17,24,39,0.9)", backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <nav className="container" style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px" }}>
          <div style={{ fontWeight: 800 }}>Admin Dashboard</div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link className="btn outline" to="/admin/dashboard">Home</Link>
            <button className="btn" onClick={doLogout}>Logout</button>
          </div>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
