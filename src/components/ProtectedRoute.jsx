import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, checked } = useAuth();

  if (!checked) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children ? children : <Outlet />;
}
