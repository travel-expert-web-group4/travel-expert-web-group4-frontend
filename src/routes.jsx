import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


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


// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import ProtectedRoute from "./components/ProtectedRoute";









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
        <Route path="/booking-confirmation" element={<BookingConfirmation />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/email-preview" element={<EmailPreview />} />
        <Route path="/packages/:id/book" element={<BookingPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contact" element={<ContactUs />} />
        
        // Example: Dashboard (any logged-in user)
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

// Example: Wallet (only customers)
<Route
  path="/wallet"
  element={
    <ProtectedRoute allowedRoles={["guest", "frequent-bronze", "frequent-platinum", "agent"]}>
      <WalletPage />
    </ProtectedRoute>
  }
/>

        
      </Routes>
      <ChatWidget />
      <Footer />
    </>
  );
}

export default AppRoutes;
