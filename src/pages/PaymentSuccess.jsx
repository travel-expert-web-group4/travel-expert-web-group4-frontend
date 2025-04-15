// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("⏳ Confirming payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const bookingNo = localStorage.getItem("paid_booking_no");

    if (!bookingNo) {
      setStatus("❌ No booking number found.");
      return;
    }

    fetch(`http://localhost:8080/api/booking/${bookingNo}/paid`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Payment confirmation failed");
        return res.json();
      })
      .then(() => {
        setStatus("✅ Booking confirmed!");
        localStorage.removeItem("paid_booking_no");
        setTimeout(() => navigate("/my-bookings"), 1500);
      })
      .catch(() => {
        setStatus("❌ Failed to confirm booking.");
      });
  }, []);

  return (
    <div className="text-center mt-20 text-gray-700 text-lg">
      {status}
    </div>
  );
};

export default PaymentSuccess;
