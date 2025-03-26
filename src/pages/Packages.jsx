import React, { useState, useEffect } from 'react';
import '../styles/Packages.css';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/mockPackages.json')
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(err => console.error("Failed to fetch packages", err));
  }, []);

  const resetFilters = () => {
    setSearchTerm("");
    setDestinationFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setMinPrice("");
    setMaxPrice("");
    setSortOption("");
    setCurrentPage(1);
  };

  const filteredPackages = packages
    .filter(pkg =>
      (pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (destinationFilter === "" || pkg.destination === destinationFilter) &&
      (startDateFilter === "" || new Date(pkg.startDate) >= new Date(startDateFilter)) &&
      (endDateFilter === "" || new Date(pkg.endDate) <= new Date(endDateFilter)) &&
      (minPrice === "" || pkg.basePrice >= Number(minPrice)) &&
      (maxPrice === "" || pkg.basePrice <= Number(maxPrice))
    )
    .sort((a, b) => {
      if (sortOption === "price") return a.basePrice - b.basePrice;
      if (sortOption === "rating") return b.rating - a.rating;
      return 0;
    });

  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage);
  const startIndex = (currentPage - 1) * packagesPerPage;
  const currentPackages = filteredPackages.slice(startIndex, startIndex + packagesPerPage);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      className="packages-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Explore Travel Packages</h1>

      {/* Filters */}
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search by destination or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={destinationFilter} onChange={(e) => setDestinationFilter(e.target.value)}>
          <option value="">All Destinations</option>
          {[...new Set(packages.map(pkg => pkg.destination))].map((dest, i) => (
            <option key={i} value={dest}>{dest}</option>
          ))}
        </select>
        <input type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
        <input type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
        <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort by</option>
          <option value="price">Price (Low to High)</option>
          <option value="rating">Rating (High to Low)</option>
        </select>
        <button className="reset-btn" onClick={resetFilters}>Reset</button>
      </div>

      {/* View Switch */}
      <div className="view-toggle">
        <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>
          🟦 Grid
        </button>
        <button className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")}>
          📃 List
        </button>
      </div>

      {/* Package List */}
      <div className={`package-list ${viewMode}`}>
        {currentPackages.length > 0 ? currentPackages.map(pkg => (
          <div key={pkg.packageId} className={`package-card ${viewMode} ${pkg.featured ? "featured" : ""}`}>
            {pkg.featured && <div className="featured-badge">🌟 Featured</div>}
            <img src={pkg.imageUrl || "https://via.placeholder.com/300x200"} alt={`Package to ${pkg.destination || "somewhere"}`} />
            <div>
              <h3>{pkg.name}</h3>
              <p><strong>Destination:</strong> {pkg.destination}</p>
              <p>{pkg.description}</p>
              <p className="rating">⭐ {pkg.rating || "N/A"}</p>
              <p><strong>Price:</strong> ${pkg.basePrice}</p>
              <button onClick={() => navigate(`/packages/${pkg.packageId}`, { state: pkg })}>
                View Details
              </button>
            </div>
          </div>
        )) : (
          <p className="empty-message">No packages match your filters.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>⬅ Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next ➡</button>
        </div>
      )}
    </motion.div>
  );
};

export default Packages;
