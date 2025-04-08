import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/PaymentPage.css";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <p>No payment info found.</p>;

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

  const totalPrice = Number(basePrice) + Number(agencyCommission);

  const [walletBalance, setWalletBalance] = useState(2000);
  const [cardNumber, setCardNumber] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [canAfford, setCanAfford] = useState(true);

  useEffect(() => {
    setCanAfford(walletBalance >= totalPrice);
  }, [walletBalance, totalPrice]);

  const handlePay = (e) => {
    e.preventDefault();
    if (!canAfford) return;

    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);

      const newBalance = walletBalance - totalPrice;
      setWalletBalance(newBalance);

      // Navigate after short animation
      setTimeout(() => {
        navigate("/booking-confirmation", {
          state: {
            ...state,
            paymentStatus: "Paid",
            newWalletBalance: newBalance
          }
        });
      }, 1500);
    }, 1800);
  };

  return (
    <motion.div
      className="payment-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Payment for Booking #{bookingNo}</h2>
      <p><strong>Package:</strong> {name}</p>
      <p><strong>Destination:</strong> {destination}</p>
      <p><strong>Travelers:</strong> {travelerCount}</p>
      <p><strong>Total to Pay:</strong> ${totalPrice}</p>
      <p><strong>Your Wallet Balance:</strong> ${walletBalance}</p>

      {!canAfford && (
        <p className="error-text">
          Insufficient funds! You need more money to complete this booking.
        </p>
      )}

      <form onSubmit={handlePay}>
        <label htmlFor="cardNumber"><strong>Card Number:</strong></label>
        <div className="card-input-wrapper">
          <span className="card-icon">💳</span>
          <input
            id="cardNumber"
            type="text"
            maxLength="16"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <small>
          * This is a simulation. No actual payment is processed.
        </small>

        <button
          type="submit"
          disabled={processing || !canAfford}
        >
          {processing ? (
            <>
              <span className="spinner"></span> Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </button>
        <button className="later" onClick={() => navigate(`/my-bookings`)}>
          Pay it later
        </button>
      </form>

      {success && (
        <motion.div
          className="success-message"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          ✅ Payment Successful!
        </motion.div>
      )}
    </motion.div>
  );
};

export default PaymentPage;
