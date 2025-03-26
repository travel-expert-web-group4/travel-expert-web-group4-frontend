import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/BookingPage.css";

const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    packageId,
    name,
    basePrice,
    agencyCommission,
    destination,
    startDate,
    endDate
  } = state;

  const totalPrice = Number(basePrice) + Number(agencyCommission);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    travelers: 1,
    tripTypeId: "L" // default: Leisure
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookingData = {
      bookingNo: "BKG-" + Math.floor(Math.random() * 100000),
      name,
      destination,
      tripStart: startDate,
      tripEnd: endDate,
      travelerCount: formData.travelers,
      tripTypeId: formData.tripTypeId,
      basePrice,
      agencyCommission
    };

    navigate("/payment", { state: bookingData });
  };

  return (
    <motion.div
      className="booking-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Book: {name}</h2>
      <p><strong>Destination:</strong> {destination}</p>
      <p><strong>Trip Dates:</strong> {startDate} to {endDate}</p>
      <p><strong>Total Price:</strong> ${totalPrice}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Your Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="travelers"
          placeholder="Number of Travelers"
          min="1"
          value={formData.travelers}
          onChange={handleChange}
          required
        />

        <label htmlFor="tripTypeId"><strong>Trip Type:</strong></label>
        <select
          name="tripTypeId"
          value={formData.tripTypeId}
          onChange={handleChange}
          required
        >
          <option value="L">Leisure</option>
          <option value="B">Business</option>
          <option value="G">Group</option>
        </select>

        <button type="submit">Confirm Booking</button>
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back to Package
        </button>
      </form>
    </motion.div>
  );
};

export default BookingPage;
