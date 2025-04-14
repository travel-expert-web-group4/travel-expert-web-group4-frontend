import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import Spinner from "../components/Spinner";
import logoBase64 from "../utils/logoBase64";
import { bookingList, deleteBooking } from "../api/booking";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const BACKEND_URL = "http://localhost:8080";
const ITEMS_PER_PAGE = 4;

const MyBookings = () => {
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  if (!isAuthenticated || !user?.webUserId) {
    return (
      <div className="p-4 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        <p className="text-gray-600">Please log in to view your bookings.</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchCustomerId = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user/${user.webUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("WebUser not found");

        const userData = await res.json();
        const customer = userData.customer;

        if (!customer?.id) throw new Error("Customer data missing");


        const bookingData = await bookingList(customer.id);
        setBookings(bookingData || []);

        if (!bookingData || bookingData.length === 0) {
          toast("You don't have any bookings yet.");
        }
      } catch (err) {
        console.error("❌ Failed to load bookings:", err);
        toast.error("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerId();
  }, [user.webUserId, token]);

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

    switch (sortOption) {
      case "date":
        updated.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        break;
      case "destination":
        updated.sort((a, b) => a.destination.localeCompare(b.destination));
        break;
      case "price":
        updated.sort(
          (a, b) =>
            b.basePrice + b.agencyCommission - (a.basePrice + a.agencyCommission)
        );
        break;
      case "paid":
        updated.sort((a, b) => {
          if (a.bookingDate === null && b.bookingDate !== null) return -1;
          if (a.bookingDate !== null && b.bookingDate === null) return 1;
          return 0;
        });
        break;
    }

    setFilteredBookings(updated);
    setCurrentPage(1);
  }, [bookings, sortOption, filterDestination, searchQuery]);

  const getTripTypeLabel = (code) => {
    switch (code) {
      case "L": return "Leisure";
      case "B": return "Business";
      case "G": return "Group";
      default: return "Unknown";
    }
  };

  const generateInvoice = (b) => {
    const total = (Number(b.basePrice) + Number(b.agencyCommission)) * Number(b.travelerCount);
    const doc = new jsPDF();

    doc.addImage(logoBase64, "PNG", 150, 10, 40, 20);
    doc.setFontSize(18);
    doc.text("Travel Experts - Booking Invoice", 20, 30);
    doc.line(20, 33, 190, 33);

    const agentName = b?.customer?.agentid
      ? `${b.customer.agentid.agtfirstname} ${b.customer.agentid.agtlastname}`
      : "N/A";

    const info = [
      `Booking No: ${b.bookingNo}`,
      `Package: ${b.name}`,
      `Destination: ${b.destination}`,
      `Trip: ${new Date(b.tripStart).toLocaleDateString()} - ${new Date(b.tripEnd).toLocaleDateString()}`,
      `Travelers: ${b.travelerCount}`,
      `Trip Type: ${getTripTypeLabel(b.tripTypeId)}`,
      `Agent: ${agentName}`,
      `Base Price: $${b.basePrice}`,
      `Agency Commission: $${b.agencyCommission}`,
      `Total: $${total.toFixed(2)}`
    ];

    doc.setFontSize(12);
    info.forEach((line, i) => doc.text(line, 20, 50 + i * 10));
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 150);
    doc.save(`invoice-${b.bookingNo}.pdf`);
    toast.success("📄 Invoice downloaded!");
  };

  const handleDelete = async (bookingNo) => {
    if (!window.confirm("Delete this booking?")) return;
    const success = await deleteBooking(bookingNo);
    if (success) {
      setBookings((prev) => prev.filter((b) => b.bookingNo !== bookingNo));
      toast.success("Booking deleted.");
    } else {
      toast.error("Failed to delete booking.");
    }
  };

  const payNow = (bookingNo) => {
    navigate("/payment", { state: { bookingNo } });
  };

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.div className="p-4 max-w-5xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Toaster position="top-center" />
      <h2 className="text-3xl font-bold mb-6 text-center">🧾 My Bookings</h2>

      <input
        type="text"
        placeholder="Search bookings..."
        className="border px-3 py-2 rounded w-full sm:w-1/2 mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <select className="border p-2 rounded" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort by</option>
          <option value="date">Date</option>
          <option value="destination">Destination</option>
          <option value="price">Price</option>
          <option value="paid">Payment Status</option>
        </select>

        <select className="border p-2 rounded" value={filterDestination} onChange={(e) => setFilterDestination(e.target.value)}>
          <option value="">All Destinations</option>
          {[...new Set(bookings.map((b) => b.destination))].map((dest, i) => (
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
          const total = b.travelerCount * (Number(b.basePrice) + Number(b.agencyCommission));
          const agentName = b?.customer?.agentid
            ? `${b.customer.agentid.agtfirstname} ${b.customer.agentid.agtlastname}`
            : "N/A";

          return (
            <motion.div key={i} className="bg-white shadow rounded p-4 mb-6 border">
              <p><strong>Booking No:</strong> {b.bookingNo}</p>
              <p><strong>Package:</strong> {b.name}</p>
              <p><strong>Destination:</strong> {b.destination}</p>
              <p><strong>Trip:</strong> {new Date(b.tripStart).toLocaleDateString()} → {new Date(b.tripEnd).toLocaleDateString()}</p>
              <p><strong>Agent:</strong> {agentName}</p>
              {/* Status temporarily removed */}
              <p><strong>Total Paid:</strong> ${total.toFixed(2)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => generateInvoice(b)} className="bg-green-600 text-white px-3 py-1 rounded">Invoice</button>
                <button onClick={() => handleDelete(b.bookingNo)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                <button onClick={() => setSelectedBooking(b)} className="bg-blue-600 text-white px-3 py-1 rounded">View Details</button>
                <button onClick={() => payNow(b.bookingNo)} className="bg-yellow-500 text-white px-3 py-1 rounded">Pay Now</button>
              </div>
            </motion.div>
          );
        })
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

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
              <p><strong>Trip:</strong> {new Date(selectedBooking.tripStart).toLocaleDateString()} → {new Date(selectedBooking.tripEnd).toLocaleDateString()}</p>
              <p><strong>Trip Type:</strong> {getTripTypeLabel(selectedBooking.tripTypeId)}</p>
              <p><strong>Travelers:</strong> {selectedBooking.travelerCount}</p>
              {/* Status removed */}
              <p><strong>Total:</strong> ${(Number(selectedBooking.basePrice) + Number(selectedBooking.agencyCommission)).toFixed(2)}</p>
              <button onClick={() => setSelectedBooking(null)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">Close</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyBookings;
