import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/PaymentPage.css";
import { bookingDetail } from "../api/booking";
import { checkOutBill } from "../api/payment";
import { useAuth } from "../contexts/AuthContext";


const PaymentPage = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!state) return <p>No payment info found.</p>;

  const { bookingNo } = state;

  // const [walletBalance, setWalletBalance] = useState(2000);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [canAfford, setCanAfford] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
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

  const calculateDiscount = (point) => {
    if(point < 5000) {
      return 1;
    } else if(point >= 5000 && point < 20000) {
      return 0.85;
    } else if(point >= 20000) {
      return 0.9;
    }
  }
  const getDetail = async (bookingNo) => {
    const discount = calculateDiscount(user.points);
    const data = await bookingDetail(bookingNo);
    if (data != null) {
      setBookingData({...data,agencyCommission:data.agencyCommission*discount,basePrice:data.basePrice*discount});
      setTotalPrice((data.basePrice + data.agencyCommission)*data.travelerCount * discount);
    }
  };

  useEffect(() => {
    getDetail(bookingNo);
  }, []);

  // useEffect(() => {
  //   setCanAfford(walletBalance >= totalPrice);
  // }, [walletBalance, totalPrice]);

  const handlePay = async (e) => {
    e.preventDefault();

    setProcessing(true);
    const res = await checkOutBill(bookingData);
    if(res != null) {
      location.href = res.sessionUrl;
    }
    setProcessing(false);
  };

  return (
    <motion.div
      className="payment-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Payment for Booking #{bookingData.bookingNo}</h2>
      <p>
        <strong>Package:</strong> {bookingData.name}
      </p>
      <p>
        <strong>Destination:</strong> {bookingData.destination}
      </p>
      <p>
        <strong>Travelers:</strong> {bookingData.travelerCount}
      </p>
      <p>
        <strong>Total to Pay:</strong> ${totalPrice}
      </p>
      {/* <p>
        <strong>Your Wallet Balance:</strong> ${walletBalance}
      </p>

      {!canAfford && (
        <p className="error-text">
          Insufficient funds! You need more money to complete this booking.
        </p>
      )} */}

        <button onClick={handlePay} disabled={processing || !canAfford}>
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
