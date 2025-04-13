import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/BookingPage.css";
import { newBooking } from "../api/booking";
import { getWeather } from "../api/weather";
import { useAuth } from "../contexts/AuthContext";

const BookingPage = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const customerId = user?.id;

  const {
    packageId,
    name,
    basePrice,
    agencyCommission,
    destination,
    startDate,
    endDate
  } = state;

  const tripPrice = Number(basePrice) + Number(agencyCommission);

  const [totalPrice,setTotalPrice] = useState(1*tripPrice)

  const [formData, setFormData] = useState({
    fullName: "", 
    travelers:"",
    travelerCount: 1,
    tripTypeId: "L"
  });

  const [weatherData,setWeatherData] = useState({
    name:"",
    country:"",
    description:"",
    temp:"",
    humidity:"",
    wind:""
  });

  const handleChange = (e) => {
    if(e.target.name == "travelerCount") {
      setTotalPrice(tripPrice * Number(e.target.value));
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fetchWeather = async (city) => {
    const data = await getWeather(city);
    if(data != null) {
      setWeatherData({
        name: data.name,
        country: data.sys.country,
        description:data.weather[0].description.toUpperCase(),
        temp:data.main.temp,
        humidity:data.main.humidity,
        wind:data.wind.speed,
      })
    }
  }

  useEffect(()=>{
    const location = destination.split(",");
    fetchWeather(location[0]);
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      name,
      destination,
      tripStart: startDate,
      tripEnd: endDate,
      travelerCount: formData.travelerCount,
      travelers: formData.travelers,
      tripTypeId: formData.tripTypeId,
      basePrice,
      agencyCommission,
      packageId
    };

    const res = await newBooking(bookingData,customerId);
    if(res != null){
      navigate("/payment", { state: { bookingNo: res.bookingNo }});
    }
  };

  const dateFormat = (date) => {
    const data = new Date(date);
    return `${data.getMonth() + 1}/${data.getDate()}/${data.getFullYear()}`;
  }

  return (
    <motion.div
      className="booking-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Book: {name}</h2>
      <p><strong>Destination:</strong> {destination}</p>
      <p><strong>Trip Dates:</strong> {dateFormat(startDate)} to {dateFormat(endDate)}</p>
      <p><strong>Trip Price:</strong> ${tripPrice}</p>
      <p><strong>Total Price:</strong> ${totalPrice}</p>
      <p><strong>Current Weather:</strong> {weatherData.description},  {weatherData.country}</p>
      <p>🌡️ Temperature: {weatherData.temp}°C</p>
      <p>💧 Humidity: {weatherData.humidity}%</p>
      <p>💨 Wind Speed: {weatherData.speed} m/s</p>

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
          type="number"
          name="travelerCount"
          placeholder="Number of Travelers"
          min="1"
          value={formData.travelerCount}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="travelers"
          placeholder="Your travelers' name"
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
