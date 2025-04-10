import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import "../styles/BookingConfirmation.css";

const BookingConfirmation = () => {
  const { state } = useLocation();

  if (!state) return <p>No booking data found.</p>;

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
    const newBooking = { ...state, savedAt: new Date().toISOString() };

    // localStorage.setItem("myBookings", JSON.stringify([...savedBookings, newBooking]));
  }, []);

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
    paymentStatus,
  } = state;

  const totalPrice = Number(basePrice) + Number(agencyCommission);

  const getTripTypeLabel = (code) => {
    switch (code) {
      case "L": return "Leisure";
      case "B": return "Business";
      case "G": return "Group";
      default: return "Unknown";
    }
  };

  const generateInvoice = () => {
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

  return (
    <motion.div
      className="booking-confirmation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>🎉 Booking Confirmed!</h2>

      <p><strong>Booking No:</strong> {bookingNo}</p>
      <p><strong>Package:</strong> {name}</p>
      <p><strong>Destination:</strong> {destination}</p>
      <p><strong>Trip Dates:</strong> {tripStart} to {tripEnd}</p>
      <p><strong>Travelers:</strong> {travelerCount}</p>
      <p><strong>Trip Type:</strong> {getTripTypeLabel(tripTypeId)}</p>

      <hr />

      <p><strong>Base Price:</strong> ${basePrice}</p>
      <p><strong>Agency Commission:</strong> ${agencyCommission}</p>
      <p><strong>Total:</strong> ${totalPrice}</p>

      {paymentStatus === "Paid" && (
        <>
          <hr />
          <p><strong>Remaining Wallet Balance:</strong> 0</p>
        </>
      )}

      <p className="confirmation-note">
        We’ve sent a confirmation email with all your booking details.
      </p>

      <div className="actions">
        <Link to="/packages">
          <button>Back to Packages</button>
        </Link>

        <button onClick={generateInvoice}>Download Invoice</button>

        <Link to="/email-preview" state={state}>
          <button>📧 View Confirmation Email</button>
        </Link>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;
