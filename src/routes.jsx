import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import PaymentPage from './pages/PaymentPage';
import MyBookings from './pages/MyBookings';
import EmailPreview from './pages/EmailPreview';
import BookingPage from './pages/BookingPage';
import WalletPage from './pages/WalletPage';
import DashboardPage from "./pages/DashboardPage";
import ContactUs from "./pages/ContactUs";
import CustomerProfile from "./pages/CustomerProfile";
import AgentProfile from './pages/AgentProfile'; 
import ChatPage from "./pages/ChatPage";

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from "./components/ProtectedRoute";
import ChatWidget from './components/ChatWidget'; 


function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/packages/:id" element={<PackageDetails />} />
        <Route path="/packages/:id/book" element={<BookingPage />} />
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/email-preview" element={<EmailPreview />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/chat" element={<ChatPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
        path="/agent-profile"
         element={
          <ProtectedRoute allowedRoles={['agent']}>
          <AgentProfile />
          </ProtectedRoute>
          }
       />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute allowedRoles={["guest", "frequent-bronze", "frequent-platinum", "agent"]}>
              <WalletPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute allowedRoles={["customer", "frequent-bronze", "frequent-platinum"]}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["customer", "frequent-bronze", "frequent-platinum"]}>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
      
      <Footer />
      <ChatWidget />
    </>
  );
}

export default AppRoutes;
