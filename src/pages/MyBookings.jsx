import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../components/Spinner";
import logoBase64 from "../utils/logoBase64";


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

  const customerId = 104;

  useEffect(() => {
    fetch(`http://localhost:8080/api/booking/customer/${customerId}`)
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch bookings:", err);
        toast.error("Failed to load bookings.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let updated = [...bookings];

    if (filterDestination) {
      updated = updated.filter(b => b.destination.toLowerCase().includes(filterDestination.toLowerCase()));
    }

    if (searchQuery) {
      updated = updated.filter(b =>
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
      updated.sort((a, b) =>
        (b.basePrice + b.agencyCommission) - (a.basePrice + a.agencyCommission)
      );
    }

    setFilteredBookings(updated);
    setCurrentPage(1); // Reset page on filter change
  }, [bookings, sortOption, filterDestination, searchQuery]);

  const getTripTypeLabel = (code) => {
    switch (code) {
      case "L": return "Leisure";
      case "B": return "Business";
      case "G": return "Group";
      default: return "Unknown";
    }
  };

  const generateInvoice = (booking) => {
    const {
      bookingNo, name, destination, tripStart, tripEnd, travelerCount,
      tripTypeId, basePrice, agencyCommission
    } = booking;
  
    const totalPrice = Number(basePrice) + Number(agencyCommission);
    const doc = new jsPDF();
  
    // Add logo image at top-right
    doc.addImage(logoBase64, 'PNG', 150, 10, 40, 20);
  
    // Title and line
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Travel Experts - Booking Invoice", 20, 30);
    doc.setLineWidth(0.5);
    doc.line(20, 33, 190, 33);
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 45;
  
    const lineSpacing = 10;
  
    doc.text(`Booking No:`, 20, y); doc.text(bookingNo, 80, y); y += lineSpacing;
    doc.text(`Package:`, 20, y); doc.text(name, 80, y); y += lineSpacing;
    doc.text(`Destination:`, 20, y); doc.text(destination, 80, y); y += lineSpacing;
    doc.text(`Trip Dates:`, 20, y); doc.text(`${new Date(tripStart).toLocaleDateString()} to ${new Date(tripEnd).toLocaleDateString()}`, 80, y); y += lineSpacing;
    doc.text(`Travelers:`, 20, y); doc.text(String(travelerCount), 80, y); y += lineSpacing;
    doc.text(`Trip Type:`, 20, y); doc.text(getTripTypeLabel(tripTypeId), 80, y); y += lineSpacing;
    doc.text(`Base Price:`, 20, y); doc.text(`$${basePrice}`, 80, y); y += lineSpacing;
    doc.text(`Agency Commission:`, 20, y); doc.text(`$${agencyCommission}`, 80, y); y += lineSpacing;
  
    // Divider
    doc.setDrawColor(100);
    doc.line(20, y + 3, 190, y + 3);
    y += lineSpacing + 3;
  
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 120);
    doc.text(`Total Paid: $${totalPrice}`, 20, y); y += lineSpacing + 5;
  
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, y);
  
    doc.save(`invoice-${bookingNo}.pdf`);
    toast.success("Invoice downloaded.");
  };
  

  const handleDelete = async (bookingNo) => {
    try {
      const res = await fetch(`http://localhost:8080/api/booking/${bookingNo}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setBookings(prev => prev.filter(b => b.bookingNo !== bookingNo));
        toast.success("Booking deleted.");
      } else {
        toast.error("Failed to delete booking.");
      }
    } catch (err) {
      toast.error("Error deleting booking.");
    }
  };

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <motion.div
      className="p-4 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster position="top-center" />

      <h2 className="text-3xl font-bold mb-6 text-center">🧾 My Bookings</h2>

      {/* 🔍 Search & Filters */}
      <input
        type="text"
        placeholder="Search bookings..."
        className="border px-3 py-2 rounded w-full sm:w-1/2 mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <select className="border p-2 rounded w-full sm:w-auto" value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="">Sort by</option>
          <option value="date">Date (Newest First)</option>
          <option value="destination">Destination (A-Z)</option>
          <option value="price">Price (High to Low)</option>
        </select>

        <select className="border p-2 rounded w-full sm:w-auto" value={filterDestination} onChange={e => setFilterDestination(e.target.value)}>
          <option value="">All Destinations</option>
          {[...new Set(bookings.map(b => b.destination))].map((dest, i) => (
            <option key={i} value={dest}>{dest}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner />
      ) : paginatedBookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        paginatedBookings.map((b, i) => {
          const totalPrice = (Number(b.basePrice) + Number(b.agencyCommission)).toFixed(2);
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

              <div className="mt-4 flex gap-3 flex-wrap">
                <button onClick={() => generateInvoice(b)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Download Invoice</button>
                <button onClick={() => handleDelete(b.bookingNo)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
                <button onClick={() => setSelectedBooking(b)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Details</button>
              </div>
            </motion.div>
          );
        })
      )}

      {/* 🔢 Pagination */}
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

      {/* 🪟 Modal for Booking Details */}
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
