import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../components/Spinner";
import logoBase64 from "../utils/logoBase64";
import { bookingList, deleteBooking } from "../api/booking";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // ✅ Use AuthContext

const ITEMS_PER_PAGE = 4;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const customerId = user?.id;

  // ⛔ Handle unauthenticated users early
  if (!isAuthenticated || !customerId) {
    return (
      <div className="p-4 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        <p className="text-gray-600">Please log in to view your bookings.</p>
      </div>
    );
  }

  // 🔄 Fetch bookings after login
  useEffect(() => {
    bookingList(customerId)
      .then((data) => {
        setBookings(data || []);
        if (!data || data.length === 0) {
          toast.error("No bookings found.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Booking fetch error:", err);
        toast.error("Failed to load bookings.");
        setLoading(false);
      });
  }, [customerId]);

 


  // 🧹 Filtering, Searching, Sorting
  useEffect(() => {
    let updated = [...bookings];

    if (filterDestination) {
      updated = updated.filter((b) =>
        b.destination.toLowerCase().includes(filterDestination.toLowerCase())
      );
    }

    if (searchQuery) {
      updated = updated.filter(
        (b) =>
          b.bookingNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "date") {
      updated.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    } else if (sortOption === "destination") {
      updated.sort((a, b) => a.destination.localeCompare(b.destination));
    } else if (sortOption === "price") {
      updated.sort(
        (a, b) =>
          b.basePrice + b.agencyCommission - (a.basePrice + a.agencyCommission)
      );
    } else if (sortOption === "paid") {
      updated.sort((a, b) => {
        if (a.bookingDate === null && b.bookingDate !== null) return -1;
        if (a.bookingDate !== null && b.bookingDate === null) return 1;
        return 0;
      });
    }

    setFilteredBookings(updated);
    setCurrentPage(1);
  }, [bookings, sortOption, filterDestination, searchQuery]);

  // 🏷️ Trip type helper
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

  // 🧾 PDF Invoice Generator
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
    doc.text("Travel Experts - Booking Invoice", 20, 30);
    doc.line(20, 33, 190, 33);

    doc.setFontSize(12);
    let y = 45;
    const spacing = 10;

    doc.text(`Booking No: ${bookingNo}`, 20, y);
    y += spacing;
    doc.text(`Package: ${name}`, 20, y);
    y += spacing;
    doc.text(`Destination: ${destination}`, 20, y);
    y += spacing;
    doc.text(
      `Trip Dates: ${new Date(tripStart).toLocaleDateString()} - ${new Date(
        tripEnd
      ).toLocaleDateString()}`,
      20,
      y
    );
    y += spacing;
    doc.text(`Travelers: ${travelerCount}`, 20, y);
    y += spacing;
    doc.text(`Trip Type: ${getTripTypeLabel(tripTypeId)}`, 20, y);
    y += spacing;
    doc.text(`Base Price: $${basePrice}`, 20, y);
    y += spacing;
    doc.text(`Agency Commission: $${agencyCommission}`, 20, y);
    y += spacing + 2;
    doc.setFontSize(14);
    doc.text(`Total Paid: $${totalPrice}`, 20, y);

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y + 10);

    doc.save(`invoice-${bookingNo}.pdf`);
    toast.success("Invoice downloaded.");
  };

  // 🗑️ Booking deletion
  const handleDelete = async (bookingNo) => {
    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (!confirm) return;

    const success = await deleteBooking(bookingNo);
    if (success) {
      setBookings((prev) => prev.filter((b) => b.bookingNo !== bookingNo));
      toast.success("Booking deleted.");
    } else {
      toast.error("Failed to delete booking.");
    }
  };

  // 🔢 Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const payNow = (bookingNo) => {
    navigate("/payment", { state: { bookingNo } });
  };

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
          <option value="paid">Payment Status</option>
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
          const totalPrice = b.travelerCount * (
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
              <p>
                <strong>Booking No:</strong> {b.bookingNo}
              </p>
              <p>
                <strong>Package:</strong> {b.name}
              </p>
              <p>
                <strong>Destination:</strong> {b.destination}
              </p>
              <p>
                <strong>Trip:</strong>{" "}
                {new Date(b.tripStart).toLocaleDateString()} to{" "}
                {new Date(b.tripEnd).toLocaleDateString()}
              </p>
              <p>
                <strong>Travelers:</strong> {b.travelerCount}
              </p>
              <p>
                <strong>Trip Type:</strong> {getTripTypeLabel(b.tripTypeId)}
              </p>
              <p>
                <strong>Total Paid:</strong> ${totalPrice}
              </p>
              <p className="text-sm text-gray-500">
                Saved on: {new Date(b.savedAt).toLocaleString()}
              </p>

              {/* 📦 Action Buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => generateInvoice(b)}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Download Invoice
                </button>
                <button
                  onClick={() => handleDelete(b.bookingNo)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete Booking
                </button>
                <button
                  onClick={() => setSelectedBooking(b)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Details
                </button>
                {b.bookingDate == null ? (
                  <button
                    onClick={() => payNow(b.bookingNo)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Pay It Now
                  </button>
                ) : (
                  ""
                )}
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
                currentPage === idx + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600"
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
              <p>
                <strong>Booking No:</strong> {selectedBooking.bookingNo}
              </p>
              <p>
                <strong>Package:</strong> {selectedBooking.name}
              </p>
              <p>
                <strong>Destination:</strong> {selectedBooking.destination}
              </p>
              <p>
                <strong>Trip:</strong>{" "}
                {new Date(selectedBooking.tripStart).toLocaleDateString()} to{" "}
                {new Date(selectedBooking.tripEnd).toLocaleDateString()}
              </p>
              <p>
                <strong>Travelers:</strong> {selectedBooking.travelerCount}
              </p>
              <p>
                <strong>Trip Type:</strong>{" "}
                {getTripTypeLabel(selectedBooking.tripTypeId)}
              </p>
              <p>
                <strong>Total:</strong> $
                {(
                  Number(selectedBooking.basePrice) +
                  Number(selectedBooking.agencyCommission)
                ).toFixed(2)}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyBookings;
