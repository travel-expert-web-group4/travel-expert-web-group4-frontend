// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode"; 
import { toast } from "react-hot-toast"; // ✅ For logout notification


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
  
  const logoutTimerRef = useRef(null); // ✅ Track logout timeout

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setToken("");
    setUser(null);
  
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
  
    toast("👋 Session ended. You’ve been logged out.");
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
  
        const expiryTime = decoded.exp * 1000; // ms
        const now = Date.now();
        const timeout = expiryTime - now;
  
        if (timeout > 0) {
          logoutTimerRef.current = setTimeout(() => {
            logout();
          }, timeout);
        } else {
          logout(); // already expired
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        logout();
      }
    } else {
      // ✅ Token is null or cleared → clear any leftover timer
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
