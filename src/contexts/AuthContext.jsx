// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 

// Create context
const AuthContext = createContext();

// Custom hook
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("jwt_token") || "");
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("jwt_token");
      return stored ? jwtDecode(stored) : null;
    } catch (e) {
      console.warn("Invalid token in localStorage:", e);
      return null;
    }
  });

  const isAuthenticated = !!token;

  const login = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      localStorage.setItem("jwt_token", newToken);
      setToken(newToken);
      setUser(decoded);
    } catch (error) {
      console.error("Login failed: Invalid JWT token.", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Error decoding token:", err);
        logout();
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
