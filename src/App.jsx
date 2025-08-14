import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
