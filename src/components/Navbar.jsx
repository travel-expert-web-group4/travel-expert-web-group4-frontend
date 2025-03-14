import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/images/logo.png"; // Corrected import path

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar" ref={navRef}>
            <div className="nav-brand">
                <img src={logo} alt="Travel Tales Logo" className="logo" />
                <span className="brand-text">Welcome to Travel Tales</span>
            </div>
            <button className="menu-toggle" onClick={toggleMenu}>
                ☰
            </button>
            <ul className={`nav-links ${isOpen ? "open" : ""}`}>
                <li><Link to="/" className={location.pathname === "/" ? "active" : ""} onClick={() => setIsOpen(false)}>Home</Link></li>
                <li><Link to="/packages" className={location.pathname === "/packages" ? "active" : ""} onClick={() => setIsOpen(false)}>Packages</Link></li>
                <li><Link to="/contact" className={location.pathname === "/contact" ? "active" : ""} onClick={() => setIsOpen(false)}>Contact Us</Link></li>
                <li><Link to="/login" className={location.pathname === "/login" ? "active" : ""} onClick={() => setIsOpen(false)}>Sign In</Link></li>
                <li><Link to="/register" className={location.pathname === "/register" ? "active" : ""} onClick={() => setIsOpen(false)}>Register</Link></li>
            </ul>
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
                <button>Search</button>
            </div>
        </nav>
    );
};

export default Navbar;