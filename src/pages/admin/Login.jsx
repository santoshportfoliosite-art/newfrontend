import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ok, err } from "../../utils/toast.js";
import "../../styles/globals.css";
import "../../styles/Pages.css";
import "../../styles/Admin.css";
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      ok(res?.message || "Login success");
      nav("/admin/dashboard", { replace: true });
    } catch (e) {
      err(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container" style={{ maxWidth: 520 }}>
      <div className="card">
        <h2>Admin Login</h2>
        <form onSubmit={submit}>
          <div style={{ marginTop: 12 }}>
            <label>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" required />
          </div>
          <div style={{ marginTop: 12 }}>
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          </div>
        </form>
        <p style={{ color: "var(--muted)", marginTop: 10 }}>
          
        </p>
      </div>
    </section>
  );
}
