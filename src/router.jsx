import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.jsx";
import SiteLayout from "./layouts/SiteLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Public pages
import Home from "./pages/public/Home.jsx";
import About from "./pages/public/About.jsx";
import Projects from "./pages/public/Projects.jsx";
import Contact from "./pages/public/Contact.jsx";
import Skills from "./pages/public/Skills.jsx";
import Education from "./pages/public/Education.jsx";

// Admin pages
import Login from "./pages/admin/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AboutSetup from "./pages/admin/AboutSetup.jsx";
import ProjectSetup from "./pages/admin/ProjectSetup.jsx";
import ContactSetup from "./pages/admin/ContactSetup.jsx";
import SkillSetup from "./pages/admin/SkillSetup.jsx";
import EducationSetup from "./pages/admin/EducationSetup.jsx";
import Messages from "./pages/admin/Messages.jsx";
import CVSetup from "./pages/admin/CVSetup.jsx";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Public
      {
        element: <SiteLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/about", element: <About /> },
          { path: "/projects", element: <Projects /> },
          { path: "/contact", element: <Contact /> },
          { path: "/skills", element: <Skills /> },
          { path: "/education", element: <Education /> }
        ]
      },

      // Admin auth
      { path: "/admin/login", element: <Login /> },

      // Admin protected
      {
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "/admin/dashboard", element: <Dashboard /> },
          { path: "/aboutsetup", element: <AboutSetup /> },
          { path: "/projectsetup", element: <ProjectSetup /> },
          { path: "/contactsetup", element: <ContactSetup /> },
          { path: "/skillsetup", element: <SkillSetup /> },
          { path: "/educationsetup", element: <EducationSetup /> },
          { path: "/messages", element: <Messages /> },
          { path: "/cv", element: <CVSetup /> },
          { path: "/admin", element: <Navigate to="/admin/dashboard" replace /> }
        ]
      },

      // Not found
      { path: "*", element: <div style={{ padding: 24 }}>Page not found</div> }
    ]
  }
]);

export default router;
