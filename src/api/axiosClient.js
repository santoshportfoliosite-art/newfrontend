// src/utils/axiosClient.js
import axios from "axios";

/** Remove trailing slashes */
const normalize = (u) => (u || "").replace(/\/+$/, "");

/** Decide base URL:
 * - Use VITE_API_URL if set (Netlify/env)
 * - If running on localhost and no env, use local backend
 * - Otherwise fall back to your Render backend
 */
function pickBase() {
  const envBase = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";
  if (envBase) return normalize(envBase);

  if (typeof window !== "undefined") {
    const h = window.location?.hostname;
    if (h === "localhost" || h === "127.0.0.1") return "http://localhost:5000";
  }
  // 🔁 Fallback to your Render URL (adjust if needed)
  return "https://backend-by61.onrender.com";
}

const BASE = normalize(pickBase());
const API_BASE = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

const axiosClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,               // needed for cookie-based auth
  timeout: 20000,
  headers: { "X-Requested-With": "XMLHttpRequest" }
});

// Optional: also attach Bearer token if you keep one for some routes
axiosClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch { /* ignore */ }
  return config;
});

// Keep 401s for your guards to handle; log network/CORS errors
axiosClient.interceptors.response.use(
  (r) => r,
  (err) => {
    if (!err?.response) {
      console.error("Network/CORS error:", err?.message || err);
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
