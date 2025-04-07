import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  // useEffect(() => {
  //   const saved = JSON.parse(localStorage.getItem("myBookings")) || [];
  //   setBookings(saved);
  // }, []);


// Simulate backend data from API
  useEffect(() => {
    fetch("/mockBookings.json")
      .then(res => res.json())
      .then(data => {
        setBookings(data);
      });
  }, []);
  

  useEffect(() => {
    let updated = [...bookings];

    if (filterDestination) {
      updated = updated.filter(b => b.destination === filterDestination);
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
  }, [bookings, sortOption, filterDestination]);

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

    doc.setFontSize(16);
    doc.text("Travel Booking Invoice", 20, 20);
    doc.setFontSize(12);

    doc.text(`Booking No: ${bookingNo}`, 20, 35);
    doc.text(`Package: ${name}`, 20, 45);
    doc.text(`Destination: ${destination}`, 20, 55);
    doc.text(`Trip Dates: ${tripStart} to ${tripEnd}`, 20, 65);
    doc.text(`Travelers: ${travelerCount}`, 20, 75);
    doc.text(`Trip Type: ${getTripTypeLabel(tripTypeId)}`, 20, 85);
    doc.text(`Base Price: $${basePrice}`, 20, 100);
    doc.text(`Agency Commission: $${agencyCommission}`, 20, 110);
    doc.text(`Total Paid: $${totalPrice}`, 20, 120);
    doc.text("Thank you for booking with Travel Tales!", 20, 140);

    doc.save(`invoice-${bookingNo}.pdf`);
  };

  const handleDelete = (indexToDelete) => {
    const updated = bookings.filter((_, i) => i !== indexToDelete);
    setBookings(updated);
    localStorage.setItem("myBookings", JSON.stringify(updated));
  };

  return (
    <motion.div
      className="my-bookings-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>🧾 My Bookings</h2>

      {/* Sort & Filter Controls */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort by</option>
          <option value="date">Date (Newest First)</option>
          <option value="destination">Destination (A-Z)</option>
          <option value="price">Price (High to Low)</option>
        </select>

        <select value={filterDestination} onChange={(e) => setFilterDestination(e.target.value)}>
          <option value="">All Destinations</option>
          {[...new Set(bookings.map(b => b.destination))].map((dest, i) => (
            <option key={i} value={dest}>{dest}</option>
          ))}
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        filteredBookings.map((b, i) => {
          const totalPrice = (Number(b.basePrice) + Number(b.agencyCommission)).toFixed(2);
          return (
            <div key={i} className="booking-card">
              <p><strong>Booking No:</strong> {b.bookingNo}</p>
              <p><strong>Package:</strong> {b.name}</p>
              <p><strong>Destination:</strong> {b.destination}</p>
              <p><strong>Trip:</strong> {b.tripStart} to {b.tripEnd}</p>
              <p><strong>Travelers:</strong> {b.travelerCount}</p>
              <p><strong>Trip Type:</strong> {getTripTypeLabel(b.tripTypeId)}</p>
              <p><strong>Total Paid:</strong> ${totalPrice}</p>
              <p><small>Saved on: {new Date(b.savedAt).toLocaleString()}</small></p>

              <div className="booking-actions">
                <button onClick={() => generateInvoice(b)}>Download Invoice</button>
                <button onClick={() => handleDelete(i)}>Delete Booking</button>
                <button
                  style={{ backgroundColor: "#0077cc", color: "#fff" }}
                  onClick={() => setSelectedBooking(b)}
                >
                  View Details
                </button>
                <button>
                  Pay It Now
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Modal for Booking Details */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            className="booking-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-content">
              <h3>📦 Booking Details</h3>
              <p><strong>Booking No:</strong> {selectedBooking.bookingNo}</p>
              <p><strong>Package:</strong> {selectedBooking.name}</p>
              <p><strong>Destination:</strong> {selectedBooking.destination}</p>
              <p><strong>Trip:</strong> {selectedBooking.tripStart} to {selectedBooking.tripEnd}</p>
              <p><strong>Travelers:</strong> {selectedBooking.travelerCount}</p>
              <p><strong>Trip Type:</strong> {getTripTypeLabel(selectedBooking.tripTypeId)}</p>
              <p><strong>Total:</strong> ${(Number(selectedBooking.basePrice) + Number(selectedBooking.agencyCommission)).toFixed(2)}</p>
              <button onClick={() => setSelectedBooking(null)}>Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyBookings;
