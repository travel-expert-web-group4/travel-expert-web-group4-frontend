import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/images/logo.png";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close the mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      <div className="nav-brand">
        <img src={logo} alt="Travel Tales Logo" className="logo" />
        <span className="brand-text">Travel Tales</span>
      </div>

      <button className="menu-toggle" onClick={toggleMenu}>☰</button>

      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/packages">Packages</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>

        {user ? (
          <>
            {user.role === "customer" && <li><Link to="/profile">My Profile</Link></li>}
            <li><Link to="/wallet">Wallet</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            {user.role === "agent" && <li><Link to="/agent-tools">Agent Tools</Link></li>}

            <li className="user-info">
              👋 {user.fullName} <span className="user-role">({user.role})</span>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
