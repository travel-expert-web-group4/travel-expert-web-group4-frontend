// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // If not logged in, redirect to login and preserve the target route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // All logged-in users (agent or customer) are allowed
};

export default ProtectedRoute;
