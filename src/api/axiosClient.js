import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: true
});

// Optional: simple response error logging
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // Let ProtectedRoute handle redirects—just bubble up the error
    }
    return Promise.reject(err);
  }
);

export default api;
