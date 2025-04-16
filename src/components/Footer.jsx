import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  return (
    <footer className="bg-[#023e93] text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in">
        {/* About */}
        <div>
          <h3 className="text-base font-semibold mb-3">About Travel Tales</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            Your trusted partner in unforgettable journeys. Discover your next adventure with us.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-base font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-1 text-xs">
            <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
            <li><Link to="/packages" className="hover:text-yellow-400">Packages</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400">Contact Us</Link></li>
            {user == null ? <li><Link to="/login" className="hover:text-yellow-400">Sign In</Link></li> : ""}
            <li><Link to="/register" className="hover:text-yellow-400">Register</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-base font-semibold mb-3">Contact Us</h3>
          <p className="text-gray-400 text-xs">📧 info@traveltales.com</p>
          <p className="text-gray-400 text-xs">📞 +1 (123) 456-7890</p>
          <p className="text-gray-400 text-xs">📍 123 Adventure St, Travel City</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-slate-800 text-center py-2 text-gray-400 text-xs border-t border-slate-700">
        &copy; {new Date().getFullYear()} Travel Tales. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
