import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axiosClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data?.data?.admin || null);
    } catch {
      setUser(null);
    } finally {
      setChecked(true);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    // Save token in localStorage so axios can send it as Bearer
    if (data?.data?.token) {
      localStorage.setItem("token", data.data.token);
    }
    setUser(data?.data?.admin || null);
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("token"); // remove from storage
    setUser(null);
  };

  const value = { user, checked, login, logout, refresh: fetchMe };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
