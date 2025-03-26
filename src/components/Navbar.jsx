import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/images/logo.png";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close on outside click
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

        {currentUser && (
          <>
            <li><Link to="/wallet">Wallet</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>

            {currentUser.role === "agent" && (
              <li><Link to="/agent-tools">Agent Tools</Link></li>
            )}
          </>
        )}

        {!currentUser ? (
          <>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <>
            <li className="user-info">
              👋 {currentUser.fullName}
              <span className="user-role">({currentUser.role})</span>
            </li>
            <li>
              <button onClick={logout} className="logout-btn">Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
