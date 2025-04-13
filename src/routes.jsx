import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Packages from "./pages/Packages";
import PackageDetails from "./pages/PackageDetails";
import BookingConfirmation from "./pages/BookingConfirmation";
import PaymentPage from "./pages/PaymentPage";
import MyBookings from "./pages/MyBookings";
import EmailPreview from "./pages/EmailPreview";
import BookingPage from "./pages/BookingPage";
import WalletPage from "./pages/WalletPage";
import DashboardPage from "./pages/DashboardPage";
import ContactUs from "./pages/ContactUs";
import UserProfile from "./pages/UserProfile";
import AgentProfile from "./pages/AgentProfile";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import ChatWidget from "./components/ChatWidget";

// ✅ Bring in user from AuthContext
import { useAuth } from "./contexts/AuthContext";

function AppRoutes() {
  const { token } = useAuth(); // ✅ Get user from context

  return (
    <>
      <Navbar />

      <main className="pt-20 px-4 min-h-screen bg-white text-gray-800">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/packages/:id/book" element={<BookingPage />} />
          <Route
            path="/booking-confirmation"
            element={<BookingConfirmation />}
          />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/email-preview" element={<EmailPreview />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/chat" element={<ChatPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/agent-profile"
            element={
              <PrivateRoute allowedRoles={["agent"]}>
                <AgentProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <PrivateRoute
                allowedRoles={[
                  "guest",
                  "frequent-bronze",
                  "frequent-platinum",
                  "agent",
                ]}
              >
                <WalletPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <PrivateRoute
                allowedRoles={[
                  "customer",
                  "frequent-bronze",
                  "frequent-platinum",
                ]}
              >
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute
                allowedRoles={[
                  "customer",
                  "frequent-bronze",
                  "frequent-platinum",
                ]}
              >
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default AppRoutes;
