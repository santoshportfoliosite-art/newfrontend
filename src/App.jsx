import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import AppInit from "./components/AppInit.jsx";
export default function App() {
  return (
    <>
     <AppInit />
    <AuthProvider>
     
      <Outlet />
      <Toaster position="top-right" />
    </AuthProvider>
    </>
  );
}
