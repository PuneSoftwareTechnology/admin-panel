import React, { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useStore from "./utils/zustand";
import AdminLogin from "./components/screens/AdminLogin";
import HomePage from "./components/screens/HomePage";
import Dashboard from "./components/screens/Dashboard";
import Settings from "./components/screens/Settings";
import DemoRequests from "./components/screens/DemoResponses";
import ErrorPage from "./components/screens/ErrorPage";
import NotAuthorized from "./components/screens/NotAuthorised";
import AllUsers from "./components/screens/AllUsers";
import ALLFAQs from "./components/screens/ALLFAQs";
import NotFound from "./components/screens/NotFound";
import AllTestimonials from "./components/screens/AllTestimonials";
import Blogs from "./components/screens/Blogs";
import Misc from "./components/screens/Misc";
import Courses from "./components/screens/Courses";
import Jobs from "./components/screens/Jobs";
import Projects from "./components/screens/Projects";
import Syllabus from "./components/screens/Syllabus"; // Add this import
import AllConsultations from "./components/screens/AllConsultations";

const ProtectedRoute = ({ element, requiredRole, redirectIfAuth = false }) => {
  const { isAuthenticated, userRole = "ADMIN" } = useStore((state) => state);

  const navigateTo = useMemo(() => {
    if (!isAuthenticated && !redirectIfAuth) return "/admin-login";
    if (redirectIfAuth && isAuthenticated) return "/home"; // Redirect logged-in users from login page
    if (requiredRole === "SUPER_ADMIN" && userRole === "ADMIN")
      return "/not-authorised"; // Block ADMIN from SUPER_ADMIN routes
    return null;
  }, [isAuthenticated, userRole, requiredRole, redirectIfAuth]);

  return navigateTo ? <Navigate to={navigateTo} /> : element;
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<ProtectedRoute element={<Navigate to="/admin-login" />} />}
      />
      <Route
        path="/admin-login"
        element={<ProtectedRoute element={<AdminLogin />} redirectIfAuth />}
      />
      <Route path="/home" element={<ProtectedRoute element={<HomePage />} />}>
        <Route index element={<div>Welcome to Home</div>} />
        <Route
          path="dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="requests"
          element={<ProtectedRoute element={<DemoRequests />} />}
        />
        <Route path="blogs" element={<ProtectedRoute element={<Blogs />} />} />
        <Route
          path="courses"
          element={<ProtectedRoute element={<Courses />} />}
        />
        <Route path="jobs" element={<ProtectedRoute element={<Jobs />} />} />
        <Route
          path="projects"
          element={<ProtectedRoute element={<Projects />} />}
        />
        <Route
          path="settings"
          element={<ProtectedRoute element={<Settings />} />}
        />
        <Route path="faqs" element={<ProtectedRoute element={<ALLFAQs />} />} />
        <Route
          path="testimonials"
          element={<ProtectedRoute element={<AllTestimonials />} />}
        />
        <Route
          path="users"
          element={
            <ProtectedRoute element={<AllUsers />} requiredRole="SUPER_ADMIN" />
          }
        />
        <Route path="misc" element={<ProtectedRoute element={<Misc />} />} />
        <Route
          path="syllabus"
          element={<ProtectedRoute element={<Syllabus />} />}
        />
        <Route
          path="consultations"
          element={<ProtectedRoute element={<AllConsultations />} />}
        />
      </Route>
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/not-authorised" element={<NotAuthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
