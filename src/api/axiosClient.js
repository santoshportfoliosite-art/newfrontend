import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const rootURL = baseURL.replace(/\/+$/, "").replace(/\/api$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

let tokenGetter = () => localStorage.getItem("token");
export const setAuthGetter = (fn) => { if (typeof fn === "function") tokenGetter = fn; };

api.interceptors.request.use((config) => {
  const token = tokenGetter();
  config.headers = { ...(config.headers || {}) };

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) localStorage.removeItem("token");
    return Promise.reject(error);
  }
);

export async function fetchWithRetry(fn, { retries = 3, baseDelay = 700 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try { return await fn(); }
    catch (err) {
      lastErr = err;
      const s = err?.response?.status;
      const isNetwork = !err?.response;
      const retryable = isNetwork || [408,425,429,500,502,503,504].includes(s);
      if (!retryable || attempt === retries) throw err;
      await new Promise(r => setTimeout(r, baseDelay * 2 ** attempt));
    }
  }
  throw lastErr;
}

export async function warmBackend() {
  try { await axios.get(`${rootURL}/health`, { timeout: 5000, withCredentials: false }); }
  catch {
    try { await axios.get(`${rootURL}/healthz`, { timeout: 5000, withCredentials: false }); }
    catch {}
  }
}

export default api;
