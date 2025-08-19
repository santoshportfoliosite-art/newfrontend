import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ok, err } from "../../utils/toast.js";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      triggerShake();
      return;
    }
    
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      ok(res?.message || "Login successful");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      triggerShake();
      err(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="login-container">
      <div className={`login-card ${shake ? "shake-animation" : ""}`}>
        <div className="login-header">
          <div className="login-logo">
            <svg viewBox="0 0 24 24" className="shield-icon">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z"/>
            </svg>
          </div>
          <h2 className="login-title">Admin Portal</h2>
          <p className="login-subtitle">Secure access to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="login-input"
              placeholder="admin@example.com"
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="login-input"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="eye-icon" viewBox="0 0 24 24">
                    <path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z"/>
                  </svg>
                ) : (
                  <svg className="eye-off-icon" viewBox="0 0 24 24">
                    <path d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22 21 20.73 3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading || !formData.email || !formData.password}
          >
            {loading ? (
              <>
                <span className="login-spinner"></span> Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="security-tip">
            <svg className="lock-icon" viewBox="0 0 24 24">
              <path d="M12 3a4 4 0 0 1 4 4v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a4 4 0 0 1 4-4m0 2a2 2 0 0 0-2 2v3h4V7a2 2 0 0 0-2-2z"/>
            </svg>
            Your credentials are encrypted
          </p>
        </div>
      </div>
    </div>
  );
}