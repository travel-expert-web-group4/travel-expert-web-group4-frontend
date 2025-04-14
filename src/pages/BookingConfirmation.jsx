import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { bookingDetail } from "../api/booking";
import { useNavigate } from "react-router-dom";
import "../styles/BookingConfirmation.css";

const BookingConfirmation = () => {
  const { state } = useLocation();
  const { bookingNo } = state;
  const [totalPrice, setTotalPrice] = useState(0);
   const navigate = useNavigate();
  // if (!state) return <p>No booking data found.</p>;

  const [bookingData, setBookingData] = useState({
    bookingNo: "",
    agencyCommission: "",
    basePrice: "",
    destination: "",
    name: "",
    savedAt: "",
    travelerCount: 0,
    travelers: "",
    tripEnd: "",
    tripStart: "",
    tripTypeId: "",
  });

  const payNow = (bookingNo) => {
    navigate("/payment", { state: { bookingNo } });
  };

  const getDetail = async (bookingNo) => {
    const data = await bookingDetail(bookingNo);
    if (data != null) {
      setBookingData({
        ...data,
        agencyCommission: data.agencyCommission,
        basePrice: data.basePrice,
      });
      setTotalPrice(
        (data.basePrice + data.agencyCommission) * data.travelerCount
      );
    }
  };

  useEffect(() => {
    getDetail(bookingNo);
  }, []);

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

  const generateInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Travel Booking Invoice", 20, 20);
    doc.setFontSize(12);
    doc.text(`Booking No: ${bookingData.bookingNo}`, 20, 35);
    doc.text(`Package: ${name}`, 20, 45);
    doc.text(`Destination: ${bookingData.destination}`, 20, 55);
    doc.text(`Trip Dates: ${bookingData.tripStart} to ${tripEnd}`, 20, 65);
    doc.text(`Travelers: ${bookingData.travelers}`, 20, 75);
    doc.text(`Trip Type: ${getTripTypeLabel(bookingData.tripTypeId)}`, 20, 85);
    doc.text(`Base Price: $${bookingData.basePrice}`, 20, 100);
    doc.text(`Agency Commission: $${bookingData.agencyCommission}`, 20, 110);
    doc.text(`Total Paid: $${totalPrice}`, 20, 120);
    doc.text("Thank you for booking with Travel Tales!", 20, 140);
    doc.save(`invoice-${bookingData.bookingNo}.pdf`);
  };

  return (
    <motion.div
      className="booking-confirmation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>🎉 Booking Confirmed!</h2>

      <p>
        <strong>Booking No:</strong> {bookingData.bookingNo}
      </p>
      <p>
        <strong>Package:</strong> {bookingData.name}
      </p>
      <p>
        <strong>Destination:</strong> {bookingData.destination}
      </p>
      <p>
        <strong>Trip Dates:</strong> {bookingData.tripStart} to {bookingData.tripEnd}
      </p>
      <p>
        <strong>Travelers:</strong> {bookingData.travelers}
      </p>
      <p>
        <strong>Trip Type:</strong> {getTripTypeLabel(bookingData.tripTypeId)}
      </p>

      <hr />

      <p>
        <strong>Base Price:</strong> ${bookingData.basePrice}
      </p>
      <p>
        <strong>Agency Commission:</strong> ${bookingData.agencyCommission}
      </p>
      <p>
        <strong>Total:</strong> ${totalPrice}
      </p>


      {/* <p className="confirmation-note">
        We’ve sent a confirmation email with all your booking details.
      </p> */}

      <div className="actions">
        <Link to="/packages">
          <button>Back to Packages</button>
        </Link>

        <button onClick={generateInvoice}>Download Invoice</button>

        <button onClick={() => payNow(bookingData.bookingNo)}>Pay It Now</button>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;
