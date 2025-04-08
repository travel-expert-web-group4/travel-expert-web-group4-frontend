import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../components/Spinner";
import logoBase64 from "../utils/logoBase64";
import { bookingList, deleteBooking } from "../api/booking";

const ITEMS_PER_PAGE = 4; // Number of bookings to show per page

const MyBookings = () => {
  // 📦 State declarations
  const [bookings, setBookings] = useState([]); // Full booking list from API
  const [filteredBookings, setFilteredBookings] = useState([]); // After filters/sorting
  const [sortOption, setSortOption] = useState(""); // Sorting dropdown
  const [filterDestination, setFilterDestination] = useState(""); // Destination filter
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [selectedBooking, setSelectedBooking] = useState(null); // For modal display
  const [loading, setLoading] = useState(true); // Spinner toggle
  const [currentPage, setCurrentPage] = useState(1); // Pagination

  const customerId = 104; // Temporary hardcoded customer ID

  // 🔄 Load bookings from API on component mount
  useEffect(() => {
    bookingList(customerId)
      .then((data) => {
        if (data) {
          setBookings(data); // Store full list
        } else {
          toast.error("No bookings found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading bookings:", err);
        toast.error("Something went wrong while loading bookings.");
        setLoading(false);
      });
  }, []);

  // 🧹 Apply filters, search, and sort every time bookings or filters change
  useEffect(() => {
    let updated = [...bookings];

    // Filter by destination
    if (filterDestination) {
      updated = updated.filter((b) =>
        b.destination.toLowerCase().includes(filterDestination.toLowerCase())
      );
    }

    // Search by bookingNo, name, or destination
    if (searchQuery) {
      updated = updated.filter(
        (b) =>
          b.bookingNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort bookings
    if (sortOption === "date") {
      updated.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    } else if (sortOption === "destination") {
      updated.sort((a, b) => a.destination.localeCompare(b.destination));
    } else if (sortOption === "price") {
      updated.sort(
        (a, b) =>
          b.basePrice + b.agencyCommission - (a.basePrice + a.agencyCommission)
      );
    }

    setFilteredBookings(updated);
    setCurrentPage(1); // Reset page on filter change
  }, [bookings, sortOption, filterDestination, searchQuery]);

  // 🏷️ Convert trip type code to readable label
  const getTripTypeLabel = (code) => {
    switch (code) {
      case "L":
        return "Leisure";
      case "B":
        return "Business";
      case "G":
        return "Group";
      default:
        return "Unknown";
    }
  };

  // 🧾 Generate PDF invoice using jsPDF
  const generateInvoice = (booking) => {
    const {
      bookingNo,
      name,
      destination,
      tripStart,
      tripEnd,
      travelerCount,
      tripTypeId,
      basePrice,
      agencyCommission,
    } = booking;

    const totalPrice = Number(basePrice) + Number(agencyCommission);
    const doc = new jsPDF();

    doc.addImage(logoBase64, "PNG", 150, 10, 40, 20);
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Travel Experts - Booking Invoice", 20, 30);
    doc.setLineWidth(0.5);
    doc.line(20, 33, 190, 33);

    // 🧾 Booking details
    doc.setFontSize(12);
    let y = 45;
    const spacing = 10;

    doc.text(`Booking No:`, 20, y);
    doc.text(bookingNo, 80, y);
    y += spacing;

    doc.text(`Package:`, 20, y);
    doc.text(name, 80, y);
    y += spacing;

    doc.text(`Destination:`, 20, y);
    doc.text(destination, 80, y);
    y += spacing;

    doc.text(`Trip Dates:`, 20, y);
    doc.text(
      `${new Date(tripStart).toLocaleDateString()} to ${new Date(
        tripEnd
      ).toLocaleDateString()}`,
      80,
      y
    );
    y += spacing;

    doc.text(`Travelers:`, 20, y);
    doc.text(String(travelerCount), 80, y);
    y += spacing;

    doc.text(`Trip Type:`, 20, y);
    doc.text(getTripTypeLabel(tripTypeId), 80, y);
    y += spacing;

    doc.text(`Base Price:`, 20, y);
    doc.text(`$${basePrice}`, 80, y);
    y += spacing;

    doc.text(`Agency Commission:`, 20, y);
    doc.text(`$${agencyCommission}`, 80, y);
    y += spacing;

    doc.setDrawColor(100);
    doc.line(20, y + 3, 190, y + 3);
    y += spacing + 3;

    doc.setFontSize(14);
    doc.setTextColor(30, 30, 120);
    doc.text(`Total Paid: $${totalPrice}`, 20, y);
    y += spacing + 5;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);

    doc.save(`invoice-${bookingNo}.pdf`);
    toast.success("Invoice downloaded.");
  };

  // 🗑️ Handle delete with confirmation
  const handleDelete = async (bookingNo) => {
    const confirmed = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmed) return;

    const success = await deleteBooking(bookingNo);
    if (success) {
      setBookings((prev) => prev.filter((b) => b.bookingNo !== bookingNo));
      toast.success("Booking deleted.");
    } else {
      toast.error("Failed to delete booking.");
    }
  };

  // 🔢 Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.div
      className="p-4 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold mb-6 text-center">🧾 My Bookings</h2>

      {/* 🔍 Search bar */}
      <input
        type="text"
        placeholder="Search bookings..."
        className="border px-3 py-2 rounded w-full sm:w-1/2 mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* 🧭 Sorting and Filtering */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="date">Date (Newest First)</option>
          <option value="destination">Destination (A-Z)</option>
          <option value="price">Price (High to Low)</option>
        </select>

        <select
          className="border p-2 rounded w-full sm:w-auto"
          value={filterDestination}
          onChange={(e) => setFilterDestination(e.target.value)}
        >
          <option value="">All Destinations</option>
          {[...new Set(bookings.map((b) => b.destination))].map((dest, i) => (
            <option key={i} value={dest}>
              {dest}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 Bookings List */}
      {loading ? (
        <Spinner />
      ) : paginatedBookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        paginatedBookings.map((b, i) => {
          const totalPrice = (
            Number(b.basePrice) + Number(b.agencyCommission)
          ).toFixed(2);
          return (
            <motion.div
              key={i}
              className="bg-white shadow rounded p-4 mb-6 border"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <p><strong>Booking No:</strong> {b.bookingNo}</p>
              <p><strong>Package:</strong> {b.name}</p>
              <p><strong>Destination:</strong> {b.destination}</p>
              <p><strong>Trip:</strong> {new Date(b.tripStart).toLocaleDateString()} to {new Date(b.tripEnd).toLocaleDateString()}</p>
              <p><strong>Travelers:</strong> {b.travelerCount}</p>
              <p><strong>Trip Type:</strong> {getTripTypeLabel(b.tripTypeId)}</p>
              <p><strong>Total Paid:</strong> ${totalPrice}</p>
              <p className="text-sm text-gray-500">Saved on: {new Date(b.savedAt).toLocaleString()}</p>

              {/* 📦 Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => generateInvoice(b)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Download Invoice</button>
                <button onClick={() => handleDelete(b.bookingNo)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete Booking</button>
                <button onClick={() => setSelectedBooking(b)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">View Details</button>
                <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  {/* TODO: Connect this button to payment logic later */}
                  Pay It Now
                </button>
              </div>
            </motion.div>
          );
        })
      )}

      {/* 🔄 Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(totalPages)].map((_, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
              }`}
            >
              {idx + 1}
            </motion.button>
          ))}
        </div>
      )}

      {/* 🪟 Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white p-6 rounded shadow w-96">
              <h3 className="text-xl font-bold mb-4">📦 Booking Details</h3>
              <p><strong>Booking No:</strong> {selectedBooking.bookingNo}</p>
              <p><strong>Package:</strong> {selectedBooking.name}</p>
              <p><strong>Destination:</strong> {selectedBooking.destination}</p>
              <p><strong>Trip:</strong> {new Date(selectedBooking.tripStart).toLocaleDateString()} to {new Date(selectedBooking.tripEnd).toLocaleDateString()}</p>
              <p><strong>Travelers:</strong> {selectedBooking.travelerCount}</p>
              <p><strong>Trip Type:</strong> {getTripTypeLabel(selectedBooking.tripTypeId)}</p>
              <p><strong>Total:</strong> ${(Number(selectedBooking.basePrice) + Number(selectedBooking.agencyCommission)).toFixed(2)}</p>
              <button className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={() => setSelectedBooking(null)}>Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyBookings;
