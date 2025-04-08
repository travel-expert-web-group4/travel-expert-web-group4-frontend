  import React, { createContext, useContext, useState } from 'react';

  // Create context
  const AuthContext = createContext();

  // Custom hook
  export const useAuth = () => useContext(AuthContext);

  // Provider component
  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
      const stored = localStorage.getItem('customer');
      return stored ? JSON.parse(stored) : null;
    });

    const login = (userData) => {
      setUser(userData);
      localStorage.setItem('customer', JSON.stringify(userData));
    };

    const logout = () => {
      setUser(null);
      localStorage.removeItem('customer');
    };

    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };