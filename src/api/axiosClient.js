// api.js
import axios from "axios";

/** Trim trailing slashes */
const normalize = (u) => (u || "").replace(/\/+$/, "");

/**
 * Use VITE_API_URL in Netlify (recommended) and fall back to your Render backend.
 * You can set VITE_API_URL to either:
 *   - https://backend-by61.onrender.com
 *   - or https://backend-by61.onrender.com/api
 * Both are handled correctly below.
 */
const RAW_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "https://backend-by61.onrender.com";

const BASE = normalize(RAW_BASE);
const API_BASE = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,              // for cookie-based auth
  timeout: 20000,
  headers: { "X-Requested-With": "XMLHttpRequest" }
});

// OPTIONAL: also support Bearer tokens if you store one (for mixed auth setups)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    else if (config.headers?.Authorization) delete config.headers.Authorization;
  } catch {
    // ignore if localStorage not available
  }
  return config;
});

// Simple response error logging + let route guards handle 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (!err?.response) {
      // Network/CORS error—useful to log during prod debugging
      console.error("Network/CORS error:", err?.message || err);
    } else if (err.response.status === 401) {
      // Let your ProtectedRoute/guards handle redirects
    }
    return Promise.reject(err);
  }
);

export default api;
