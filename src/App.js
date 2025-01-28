import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useStore from "./utils/zustand";
import AdminLogin from "./components/screens/AdminLogin";
import HomePage from "./components/screens/HomePage";
import Dashboard from "./components/screens/Dashboard";
import Settings from "./components/screens/Settings";
import DemoRequests from "./components/screens/DemoResponses";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/admin-login" />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/home" element={<ProtectedRoute element={<HomePage />} />}>
        <Route index element={<div>Welcome to Home</div>} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="requests" element={<DemoRequests />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default App;
