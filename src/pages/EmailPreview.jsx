import React from "react";
import { useLocation, Link } from "react-router-dom";
import jsPDF from "jspdf";

const EmailPreview = () => {
  const { state } = useLocation();

  if (!state) return <p>No booking info available.</p>;

  const {
    bookingNo,
    name,
    destination,
    tripStart,
    tripEnd,
    travelerCount,
    tripTypeId,
    basePrice,
    agencyCommission
  } = state;

  const total = Number(basePrice) + Number(agencyCommission);

  const getTripTypeLabel = (code) => {
    switch (code) {
      case "L": return "Leisure";
      case "B": return "Business";
      case "G": return "Group";
      default: return "Unknown";
    }
  };

  const downloadEmailAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`📧 Travel Booking Confirmation`, 20, 20);
    doc.setFontSize(11);

    doc.text(`Hello,`, 20, 35);
    doc.text(`Thank you for booking your trip with Travel Tales!`, 20, 45);
    doc.text(`Here are your booking details:`, 20, 55);

    doc.text(`Booking No: ${bookingNo}`, 20, 70);
    doc.text(`Package: ${name}`, 20, 80);
    doc.text(`Destination: ${destination}`, 20, 90);
    doc.text(`Trip Dates: ${tripStart} to ${tripEnd}`, 20, 100);
    doc.text(`Trip Type: ${getTripTypeLabel(tripTypeId)}`, 20, 110);
    doc.text(`Travelers: ${travelerCount}`, 20, 120);
    doc.text(`Total: $${total}`, 20, 130);

    doc.text(`We look forward to giving you an amazing travel experience!`, 20, 150);
    doc.text(`– The Travel Tales Team`, 20, 160);

    doc.save(`email-confirmation-${bookingNo}.pdf`);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto", fontFamily: "sans-serif" }}>
      <h2>📨 Email Confirmation Preview</h2>
      <p>Hello,</p>
      <p>Thank you for booking your trip with <strong>Travel Tales</strong>!</p>
      <p>Here are your booking details:</p>

      <ul>
        <li><strong>Booking No:</strong> {bookingNo}</li>
        <li><strong>Package:</strong> {name}</li>
        <li><strong>Destination:</strong> {destination}</li>
        <li><strong>Trip Dates:</strong> {tripStart} to {tripEnd}</li>
        <li><strong>Trip Type:</strong> {getTripTypeLabel(tripTypeId)}</li>
        <li><strong>Travelers:</strong> {travelerCount}</li>
        <li><strong>Total:</strong> ${total}</li>
      </ul>

      <p>We look forward to giving you an amazing travel experience!</p>
      <p>– The Travel Tales Team</p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button onClick={downloadEmailAsPDF} style={{ padding: "0.5rem 1rem", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px" }}>
          📥 Download as PDF
        </button>
        <Link to="/packages">
          <button style={{ padding: "0.5rem 1rem", backgroundColor: "#0077cc", color: "white", border: "none", borderRadius: "5px" }}>
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EmailPreview;
