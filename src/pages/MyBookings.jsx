import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import logoBase64 from "../utils/logoBase64";
import Spinner from "../components/Spinner";
import { bookingList, deleteBooking } from "../api/booking";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import "../styles/MyBookings.css";

const MyBookings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!loading && user?.customer?.id) {
      fetchBookings(user.customer.id);
    }
  }, [user, loading]);

  const fetchBookings = async (customerId) => {
    setLoadingBookings(true);
    try {
      const data = await bookingList(customerId);
      setBookings(data || []);
    } catch (err) {
      toast.error("Failed to load bookings.");
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleDelete = async (bookingNo) => {
    const confirm = window.confirm(`Are you sure you want to cancel booking #${bookingNo}?`);
    if (!confirm) return;
    const result = await deleteBooking(bookingNo);
    if (result) {
      toast.success("Booking cancelled.");
      setBookings(bookings.filter((b) => b.bookingNo !== bookingNo));
    } else {
      toast.error("Failed to cancel booking.");
    }
  };

  const handleDownload = (booking) => {
    const doc = new jsPDF();
    doc.addImage(logoBase64, "PNG", 10, 10, 50, 20);
    doc.setFontSize(16);
    doc.text(`Booking Invoice #${booking.bookingNo}`, 70, 40);
    doc.setFontSize(12);
    doc.text(`Package: ${booking.name}`, 10, 60);
    doc.text(`Destination: ${booking.destination}`, 10, 70);
    doc.text(`Travelers: ${booking.travelerCount}`, 10, 80);
    doc.text(`Trip Dates: ${booking.tripStart} to ${booking.tripEnd}`, 10, 90);
    doc.text(`Price: $${booking.basePrice} + $${booking.agencyCommission}`, 10, 100);
    doc.text(`Agent: ${user.customer?.agent?.agtFirstName || "N/A"}`, 10, 110);
    doc.save(`invoice-${booking.bookingNo}.pdf`);
  };

  const getBookingStatus = (booking) => {
    if (booking.bookingDate) return "Paid";
    const savedAt = new Date(booking.savedAt);
    const now = new Date();
    const diffHours = (now - savedAt) / (1000 * 60 * 60);
    return diffHours <= 24 ? "Unpaid" : "Cancelled";
  };

  if (!user || loading) {
    return <Spinner message="Loading profile..." />;
  }

  if (loadingBookings) {
    return <Spinner message="Loading your bookings..." />;
  }

  if (bookings.length === 0) {
    return <p className="text-center py-10 text-gray-500">You have no bookings yet.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-8">
      <Toaster />
      <h1 className="text-2xl font-semibold mb-6 text-blue-800">My Bookings</h1>

      <div className="grid gap-6">
        <AnimatePresence>
          {bookings.map((booking) => (
            <motion.div
              key={booking.bookingNo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border rounded-lg p-4 bg-white shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-blue-700">#{booking.bookingNo}</h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    getBookingStatus(booking) === "Paid"
                      ? "bg-green-100 text-green-700"
                      : getBookingStatus(booking) === "Unpaid"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {getBookingStatus(booking)}
                </span>
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Package:</strong> {booking.name}</p>
                <p><strong>Destination:</strong> {booking.destination}</p>
                <p><strong>Trip:</strong> {booking.tripStart} to {booking.tripEnd}</p>
                <p><strong>Travelers:</strong> {booking.travelerCount}</p>
                <p><strong>Agent:</strong> {user.customer?.agent?.agtFirstName || "N/A"}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {booking.bookingDate === null && getBookingStatus(booking) === "Unpaid" && (
                  <button
                    onClick={() => navigate("/payment", { state: { bookingNo: booking.bookingNo } })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Pay Now
                  </button>
                )}
                <button
                  onClick={() => handleDownload(booking)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
                >
                  Download Invoice
                </button>
                <button
                  onClick={() => handleDelete(booking.bookingNo)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded"
                >
                  Cancel Booking
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyBookings;
