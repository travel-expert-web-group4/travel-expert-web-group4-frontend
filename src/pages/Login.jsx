import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from?.pathname || "/profile";


  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const res = await fetch("/mockUsers.json");
    const users = await res.json();
  
    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );
  
    if (!user) {
      setError("Invalid email or password.");
      return;
    }
  
    // Add fullName field for Navbar & profile
    login({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`
    });
  
    navigate(redirectTo, { replace: true }); // goes to /profile or where user was before
  };
  
  
  

  return (
    <div className="login-container">
      <h2>🔐 Sign In</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign In</button>
      </form>

      <p className="login-footer">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default Login;
