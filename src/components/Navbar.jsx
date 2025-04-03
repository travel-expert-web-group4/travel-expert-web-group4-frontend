import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/images/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faWallet,
  faSuitcase,
  faChartLine,
  faTools,
  faSignOutAlt,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  // Access the user and logout function from Auth context
  const { user, logout } = useAuth();

  // Track if mobile menu and dropdown are open
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Refs to detect clicks outside
  const navRef = useRef(null);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Toggle mobile nav menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Toggle dropdown under user avatar
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown after clicking a menu item
  const handleMenuItemClick = () => setDropdownOpen(false);

  // Close menus if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar" ref={navRef}>
      {/* Brand section */}
      <div className="nav-brand">
        <img src={logo} alt="Travel Tales Logo" className="logo" />
        <span className="brand-text">Travel Tales</span>
      </div>

      {/* Mobile toggle button */}
      <button className="menu-toggle" onClick={toggleMenu}>☰</button>

      {/* Main navigation links */}
      <ul className={`nav-links ${isOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/packages">Packages</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>

        {/* If user is logged in, show user dropdown */}
        {user ? (
          <li className="user-dropdown" ref={dropdownRef}>
            {/* User button with avatar + dropdown arrow */}
            <button
              onClick={toggleDropdown}
              className={`user-btn ${dropdownOpen ? "open" : ""}`}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=0D8ABC&color=fff&size=32`}
                alt="avatar"
                className="user-avatar"
              />
              {user.fullName}
              <span className="user-role">({user.role})</span>
              <FontAwesomeIcon icon={faChevronDown} className="dropdown-arrow" />
            </button>

            {/* Dropdown menu (appears when dropdownOpen is true) */}
            {dropdownOpen && (
              <div className="dropdown-container">
                <ul className={`dropdown-menu show`}>
                  {/* Role-specific items */}
                  {user.role === "customer" && (
                    <li>
                      <Link to="/profile" onClick={handleMenuItemClick}>
                        <FontAwesomeIcon icon={faUser} /> My Profile
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="/wallet" onClick={handleMenuItemClick}>
                      <FontAwesomeIcon icon={faWallet} /> Wallet
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-bookings" onClick={handleMenuItemClick}>
                      <FontAwesomeIcon icon={faSuitcase} /> My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" onClick={handleMenuItemClick}>
                      <FontAwesomeIcon icon={faChartLine} /> Dashboard
                    </Link>
                  </li>
                  {user.role === "agent" && (
                    <li>
                      <Link to="/agent-tools" onClick={handleMenuItemClick}>
                        <FontAwesomeIcon icon={faTools} /> Agent Tools
                      </Link>
                    </li>
                  )}

                  {/* Logout option with top divider */}
                  <li className="logout-divider">
                     <button
                      onClick={() => {
                       logout();
                      handleMenuItemClick();
                      }}
                      className="logout-btn"
                      >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span className="logout-text">Logout</span>
                     </button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        ) : (
          // If user is not logged in, show Sign In / Register
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
