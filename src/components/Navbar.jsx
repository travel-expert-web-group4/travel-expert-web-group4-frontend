// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserPlus,
  faWallet,
  faSuitcase,
  faChartLine,
  faTools,
  faSignOutAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleMenuItemClick = () => setDropdownOpen(false);
 
  useEffect(() => {
    const isHome = location.pathname === "/";

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

    const handleScroll = () => {
      setScrolled(!isHome || window.scrollY > 10);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  // ✅ NEW: Recalculate role/display name on every render
  const displayName = user?.fullName || user?.username || user?.sub || "User";
  const userRole = user?.role?.replace("ROLE_", "").toLowerCase() || "guest";

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-inter bg-[#023e93] text-white ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-8 sm:h-10" />
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-bold tracking-wide">Travel Tales</span>
            <span className="text-xs text-gray-300 animate-fade-in">Explore. Dream. Discover.</span>
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl">☰</button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row md:items-center gap-4 absolute md:static top-16 left-0 w-full md:w-auto bg-blue-900 md:bg-transparent text-white p-4 md:p-0`}
        >
          {["/", "/packages", "/contact"].map((path, i) => {
            const labels = ["Home", "Packages", "Contact Us"];
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`px-3 py-2 rounded text-base transition ${
                    location.pathname === path
                      ? "text-yellow-300 font-semibold"
                      : "hover:text-yellow-300"
                  }`}
                >
                  {labels[i]}
                </Link>
              </li>
            );
          })}

          {/* Auth Section */}
          {user ? (
            <li ref={dropdownRef} className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 transition-all backdrop-blur-sm"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    displayName
                  )}&background=0D8ABC&color=fff&size=32`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">
                  {displayName}{" "}
                  <span className="text-gray-500 font-normal">({userRole})</span>
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`ml-1 text-gray-500 text-xs transition-transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <ul
                className={`absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl z-50 transform transition-all duration-200 origin-top divide-y divide-gray-100 ${
                  dropdownOpen
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
              >
                {userRole === "customer" && (
                  <li>
                    <Link
                      to="/profile"
                      onClick={handleMenuItemClick}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                      My Profile
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    to="/wallet"
                    onClick={handleMenuItemClick}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <FontAwesomeIcon icon={faWallet} className="mr-2 text-gray-500" />
                    Wallet
                  </Link>
                </li>
                <li>
                  <Link
                    to="/my-bookings"
                    onClick={handleMenuItemClick}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <FontAwesomeIcon icon={faSuitcase} className="mr-2 text-gray-500" />
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    onClick={handleMenuItemClick}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <FontAwesomeIcon icon={faChartLine} className="mr-2 text-gray-500" />
                    Dashboard
                  </Link>
                </li>
                {userRole === "agent" && (
                  <li>
                    <Link
                      to="/agent-tools"
                      onClick={handleMenuItemClick}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      <FontAwesomeIcon icon={faTools} className="mr-2 text-gray-500" />
                      Agent Tools
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                      handleMenuItemClick();
                    }}
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-100 border-t transition"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-gray-500" />
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-white hover:text-yellow-300 font-medium px-3 py-2 rounded transition"
                >
                  <FontAwesomeIcon icon={faUser} className="text-sm" />
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center gap-2 text-white hover:text-yellow-300 font-medium px-3 py-2 rounded transition"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="text-sm" />
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
