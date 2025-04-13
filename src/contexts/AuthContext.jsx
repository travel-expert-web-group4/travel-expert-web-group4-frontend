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
      if (!newToken || typeof newToken !== "string") {
        throw new Error("Token is missing or not a valid string.");
      }
  
      // ✂️ Remove "Bearer " prefix (if present)
      const cleanToken = newToken.startsWith("Bearer ")
        ? newToken.slice(7)
        : newToken;
  
      // 🧾 Decode token payload
      const decoded = jwtDecode(cleanToken);
  
      // 🗃 Save token locally
      localStorage.setItem("jwt_token", cleanToken);
  
      // 🧠 Update AuthContext states
      setToken(cleanToken);
      setUser(decoded);
    } catch (error) {
      console.error("Login failed:", error.message);
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
