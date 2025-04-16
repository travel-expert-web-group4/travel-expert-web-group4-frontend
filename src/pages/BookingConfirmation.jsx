// import React, { useState, useEffect } from "react";
// import { useLocation, Link } from "react-router-dom";
// import jsPDF from "jspdf";
// import { motion } from "framer-motion";
// import { bookingDetail } from "../api/booking";
// import { useNavigate } from "react-router-dom";
// import "../styles/BookingConfirmation.css";

// const BookingConfirmation = () => {
//   const { state } = useLocation();
//   const { bookingNo } = state;
//   const [totalPrice, setTotalPrice] = useState(0);
//    const navigate = useNavigate();
//   // if (!state) return <p>No booking data found.</p>;

//   const [bookingData, setBookingData] = useState({
//     bookingNo: "",
//     agencyCommission: "",
//     basePrice: "",
//     destination: "",
//     name: "",
//     savedAt: "",
//     travelerCount: 0,
//     travelers: "",
//     tripEnd: "",
//     tripStart: "",
//     tripTypeId: "",
//   });

//   const payNow = (bookingNo) => {
//     navigate("/payment", { state: { bookingNo } });
//   };

//   const getDetail = async (bookingNo) => {
//     const data = await bookingDetail(bookingNo);
//     if (data != null) {
//       setBookingData({
//         ...data,
//         agencyCommission: data.agencyCommission,
//         basePrice: data.basePrice,
//       });
//       setTotalPrice(
//         (data.basePrice + data.agencyCommission) * data.travelerCount
//       );
//     }
//   };

//   useEffect(() => {
//     getDetail(bookingNo);
//   }, []);

//   const getTripTypeLabel = (code) => {
//     switch (code) {
//       case "L":
//         return "Leisure";
//       case "B":
//         return "Business";
//       case "G":
//         return "Group";
//       default:
//         return "Unknown";
//     }
//   };

//   const generateInvoice = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("Travel Booking Invoice", 20, 20);
//     doc.setFontSize(12);
//     doc.text(`Booking No: ${bookingData.bookingNo}`, 20, 35);
//     doc.text(`Package: ${name}`, 20, 45);
//     doc.text(`Destination: ${bookingData.destination}`, 20, 55);
//     doc.text(`Trip Dates: ${bookingData.tripStart} to ${tripEnd}`, 20, 65);
//     doc.text(`Travelers: ${bookingData.travelers}`, 20, 75);
//     doc.text(`Trip Type: ${getTripTypeLabel(bookingData.tripTypeId)}`, 20, 85);
//     doc.text(`Base Price: $${bookingData.basePrice}`, 20, 100);
//     doc.text(`Agency Commission: $${bookingData.agencyCommission}`, 20, 110);
//     doc.text(`Total Paid: $${totalPrice}`, 20, 120);
//     doc.text("Thank you for booking with Travel Tales!", 20, 140);
//     doc.save(`invoice-${bookingData.bookingNo}.pdf`);
//   };

//   return (
//     <motion.div
//       className="booking-confirmation"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h2>🎉 Booking Confirmed!</h2>

//       <p>
//         <strong>Booking No:</strong> {bookingData.bookingNo}
//       </p>
//       <p>
//         <strong>Package:</strong> {bookingData.name}
//       </p>
//       <p>
//         <strong>Destination:</strong> {bookingData.destination}
//       </p>
//       <p>
//         <strong>Trip Dates:</strong> {bookingData.tripStart} to {bookingData.tripEnd}
//       </p>
//       <p>
//         <strong>Travelers:</strong> {bookingData.travelers}
//       </p>
//       <p>
//         <strong>Trip Type:</strong> {getTripTypeLabel(bookingData.tripTypeId)}
//       </p>

//       <hr />

//       <p>
//         <strong>Base Price:</strong> ${bookingData.basePrice}
//       </p>
//       <p>
//         <strong>Agency Commission:</strong> ${bookingData.agencyCommission}
//       </p>
//       <p>
//         <strong>Total:</strong> ${totalPrice}
//       </p>


//       {/* <p className="confirmation-note">
//         We’ve sent a confirmation email with all your booking details.
//       </p> */}

//       <div className="actions">
//         <Link to="/packages">
//           <button>Back to Packages</button>
//         </Link>

//         <button onClick={generateInvoice}>Download Invoice</button>

//         <button onClick={() => payNow(bookingData.bookingNo)}>Pay It Now</button>
//       </div>
//     </motion.div>
//   );
// };

// export default BookingConfirmation;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { bookingDetail } from "../api/booking";
import toast from "react-hot-toast";
import logoBase64 from "../utils/logoBase64";
import QRCode from "qrcode";
import { useAuth } from "../contexts/AuthContext"; // ✅

const BookingConfirmation = () => {
  const { user } = useAuth(); // ✅ access JWT claims like user.sub
  const { state } = useLocation();
  const navigate = useNavigate();

  const [bookingNo, setBookingNo] = useState(state?.bookingNo || null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [points, setPoints] = useState(0);
  const [agentName, setAgentName] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState(null);

  const [bookingData, setBookingData] = useState({
    bookingNo: "",
    agencyCommission: 0,
    basePrice: 0,
    destination: "",
    name: "",
    savedAt: "",
    travelerCount: 0,
    travelers: "",
    tripEnd: "",
    tripStart: "",
    tripTypeId: "",
    bookingDate: null,
  });

  // Restore bookingNo if not passed via state
  useEffect(() => {
    if (!bookingNo) {
      const stored = sessionStorage.getItem("confirmedBookingNo");
      if (stored) {
        setBookingNo(stored);
      } else {
        toast.error("No booking number found.");
        navigate("/packages");
      }
    } else {
      sessionStorage.setItem("confirmedBookingNo", bookingNo);
    }
  }, [bookingNo]);

  useEffect(() => {
    if (bookingNo) getDetail(bookingNo);
  }, [bookingNo]);

  const getDetail = async (bookingNo) => {
    const data = await bookingDetail(bookingNo);
    if (data) {
      setBookingData(data);
      const total = (Number(data.basePrice) + Number(data.agencyCommission)) * Number(data.travelerCount);
      setTotalPrice(total);

      // Simulate points (10% of base price * traveler count)
      const earned = Math.round(total * 0.01);
      setPoints(earned);

      // Get agent name if available in token
      const name = user?.agentName || null;
      if (name) setAgentName(name);

      // Generate QR Code
      const qr = await QRCode.toDataURL(`Booking#${data.bookingNo} - ${data.name}`);
      setQrImageUrl(qr);
    }
  };

  const getTripTypeLabel = (code) => {
    switch (code) {
      case "L": return "Leisure";
      case "B": return "Business";
      case "G": return "Group";
      default: return "Unknown";
    }
  };

  const generateInvoice = async () => {
    const doc = new jsPDF();
    const customerEmail = user?.sub || "Unknown";
    const agentName = user?.agentName || "N/A";
    const paymentStatus = bookingData.bookingDate ? "PAID" : "UNPAID";
  
    // Optional: calculate points earned (1 point per $100 spent)
    const points = Math.floor(totalPrice / 100);
  
    // Optional QR code content
    const qrContent = `Booking: ${bookingData.bookingNo}\nEmail: ${customerEmail}\nTotal: $${totalPrice}`;
    const qrImageUrl = await QRCode.toDataURL(qrContent);
  
    // Draw logo and heading
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.addImage(logoBase64, "JPEG", 150, 10, 40, 15);
    doc.text("Travel Tales - Booking Invoice", 20, 20);
  
    // Booking info
    doc.setFontSize(12);
    doc.text(`Booking No: ${bookingData.bookingNo}`, 20, 35);
    doc.text(`Customer Email: ${customerEmail}`, 20, 42);
    doc.text(`Agent: ${agentName}`, 20, 49);
    doc.text(`Package: ${bookingData.name}`, 20, 56);
    doc.text(`Destination: ${bookingData.destination}`, 20, 63);
    doc.text(`Trip Dates: ${bookingData.tripStart} to ${bookingData.tripEnd}`, 20, 70);
    doc.text(`Travelers: ${bookingData.travelerCount}`, 20, 77);
    doc.text(`Trip Type: ${getTripTypeLabel(bookingData.tripTypeId)}`, 20, 84);
    doc.text(`Payment Status: ${paymentStatus}`, 20, 91);
  
    doc.line(20, 95, 190, 95); // separator line
  
    // Pricing
    doc.text(`Base Price / person: $${bookingData.basePrice}`, 20, 105);
    doc.text(`Agency Commission / person: $${bookingData.agencyCommission}`, 20, 112);
    doc.setFont(undefined, "bold");
    doc.text(`Total Paid: $${totalPrice}`, 20, 122);
    doc.setFont(undefined, "normal");
    doc.text(`Points Earned: ${points}`, 20, 129);
  
    // QR Code (optional)
    if (qrImageUrl) {
      doc.addImage(qrImageUrl, "PNG", 150, 105, 40, 40);
    }
  
    // Footer
    doc.text("Thank you for booking with Travel Tales!", 20, 150);
  
    // Save PDF
    doc.save(`invoice-${bookingData.bookingNo}.pdf`);
  };
  

  const payNow = () => {
    navigate("/payment", { state: { bookingNo } });
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto py-10 px-6 bg-white shadow rounded"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-green-700 mb-4">🎉 Booking Confirmed!</h2>

      <div className="space-y-2 text-gray-800 text-sm">
        <p><strong>Booking No:</strong> {bookingData.bookingNo}</p>
        <p><strong>Package:</strong> {bookingData.name}</p>
        <p><strong>Destination:</strong> {bookingData.destination}</p>
        <p><strong>Trip Dates:</strong> {bookingData.tripStart} → {bookingData.tripEnd}</p>
        <p><strong>Travelers:</strong> {bookingData.travelerCount}</p>
        <p><strong>Trip Type:</strong> {getTripTypeLabel(bookingData.tripTypeId)}</p>
        <p><strong>Payment Status:</strong> {bookingData.bookingDate ? "✅ Paid" : "❌ Unpaid"}</p>
      </div>

      <hr className="my-4" />

      <div className="space-y-2 text-sm">
        <p><strong>Base Price:</strong> ${bookingData.basePrice}</p>
        <p><strong>Agency Commission:</strong> ${bookingData.agencyCommission}</p>
        <p><strong>Points Earned:</strong> {points}</p>
        <p className="font-semibold"><strong>Total:</strong> ${totalPrice}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link to="/packages">
          <button className="bg-gray-100 border border-gray-300 px-4 py-2 rounded hover:bg-gray-200">
            ← Back to Packages
          </button>
        </Link>
        <button
          onClick={generateInvoice}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download Invoice
        </button>
        <button
          onClick={payNow}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Pay It Now
        </button>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;
