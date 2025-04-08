import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaTh, FaList } from "react-icons/fa";

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const packagesPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:8080/api/package/list")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load packages");
        return res.json();
      })
      .then((data) => {
        const mappedPackages = data.map((pkg) => ({
          packageId: pkg.id,
          name: pkg.pkgname,
          startDate: pkg.pkgstartdate,
          endDate: pkg.pkgenddate,
          description: pkg.pkgdesc,
          basePrice: pkg.pkgbaseprice,
          imageUrl: pkg.imageUrl,
          destination: pkg.destination || "",
          rating: pkg.rating || null,
          reviews: pkg.reviews || [],
          featured: false,
        }));
        setPackages(mappedPackages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch packages", err);
        setError("Something went wrong while loading packages.");
        setLoading(false);
      });
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
    .filter((pkg) =>
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
  const currentPackages = filteredPackages.slice(
    startIndex,
    startIndex + packagesPerPage
  );

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div id="packages" className="min-h-screen bg-slate-50 pt-28 pb-10 px-4 md:px-12">
      <motion.h1
        className="text-3xl font-bold text-center text-blue-700 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🌍 Explore Travel Packages
      </motion.h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-3 mb-6 items-center justify-between">
        <input
          type="text"
          placeholder="Search destination or title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-48"
        />
        <select
          value={destinationFilter}
          onChange={(e) => setDestinationFilter(e.target.value)}
          className="border p-2 rounded w-full sm:w-44"
        >
          <option value="">All Destinations</option>
          {[...new Set(packages.map((pkg) => pkg.destination))].map((dest, i) => (
            <option key={i} value={dest}>
              {dest}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={startDateFilter}
          onChange={(e) => setStartDateFilter(e.target.value)}
          className="border p-2 rounded w-full sm:w-40"
        />
        <input
          type="date"
          value={endDateFilter}
          onChange={(e) => setEndDateFilter(e.target.value)}
          className="border p-2 rounded w-full sm:w-40"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded w-full sm:w-32"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded w-full sm:w-32"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-2 rounded w-full sm:w-44"
        >
          <option value="">Sort by</option>
          <option value="price">Price (Low to High)</option>
          <option value="rating">Rating (High to Low)</option>
        </select>
        <button
          onClick={resetFilters}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {/* View Switch */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          <FaTh />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white border"}`}
        >
          <FaList />
        </button>
      </div>

      {/* Package Cards */}
      <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}`}>
        {loading ? (
          <p className="text-center text-gray-500">Loading packages...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : currentPackages.length > 0 ? (
          currentPackages.map((pkg) => (
            <motion.div
              key={pkg.packageId}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition ${
                viewMode === "list" ? "flex gap-4 p-4" : "p-4"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={pkg.imageUrl || "https://source.unsplash.com/400x250/?travel"}
                alt={pkg.name}
                className="w-full h-[200px] object-cover rounded"
              />
              <div className="mt-4 space-y-1 text-sm text-gray-800">
                <h3 className="text-lg font-semibold text-blue-700">{pkg.name}</h3>
                <p><strong>Destination:</strong> {pkg.destination || <span className="italic text-gray-400">Not specified</span>}</p>
                <p>{pkg.description}</p>
                <p>⭐ {pkg.rating || "N/A"}</p>
                <p className="text-green-600 font-bold">Price: ${pkg.basePrice}</p>
                <button
                  onClick={() => navigate(`/packages/${pkg.packageId}`, { state: pkg })}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No packages match your filters.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white border border-blue-600 text-blue-600"
              } hover:bg-blue-700 hover:text-white`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default Packages;
