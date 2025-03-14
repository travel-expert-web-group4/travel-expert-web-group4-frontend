import React from "react";
import { Link } from "react-router-dom"; // Use Link for internal navigation
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "../styles/Footer.css"; // Ensure the CSS file exists

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* About Section */}
                <div className="footer-section">
                    <h3>About Travel Tales</h3>
                    <p>Your trusted partner in creating unforgettable journeys. Explore the world with us and discover your next adventure.</p>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/packages">Packages</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/login">Sign In</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: info@traveltales.com</p>
                    <p>Phone: +1 (123) 456-7890</p>
                    <p>Address: 123 Adventure St, Travel City, World</p>
                </div>

                {/* Social Media Section */}
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /> Facebook</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /> Twitter</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /> LinkedIn</a>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Travel Tales. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
