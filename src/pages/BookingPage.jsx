// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import "../styles/BookingPage.css";
// import { newBooking } from "../api/booking";
// import { getWeather } from "../api/weather";
// import toast, { Toaster }  from "react-hot-toast";
// import { useAuth } from "../contexts/AuthContext";
// import { validateName,validateMultipleName} from "../utils/validate"

// const BookingPage = () => {
//   const { state } = useLocation();
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const customerId = user?.customerId;
  

//   const validateInput = (formData) => {
//     if(!validateName(formData.name)){
//       return false;
//     }
//     if(!validateMultipleName(formData.travelers)){
//       return false;
//     }
//     return true;
//   }

//   const {
//     packageId,
//     name,
//     basePrice,
//     agencyCommission,
//     destination,
//     startDate,
//     endDate
//   } = state;

//   const tripPrice = Number(basePrice) + Number(agencyCommission);

//   const [totalPrice,setTotalPrice] = useState(1*tripPrice)

//   const [formData, setFormData] = useState({
//     fullName: "", 
//     travelers:"",
//     travelerCount: 1,
//     tripTypeId: "L"
//   });

//   const [weatherData,setWeatherData] = useState({
//     name:"",
//     country:"",
//     description:"",
//     temp:"",
//     humidity:"",
//     wind:""
//   });

//   const handleChange = (e) => {
//     if(e.target.name == "travelerCount") {
//       setTotalPrice(tripPrice * Number(e.target.value));
//     }
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const fetchWeather = async (city) => {
//     const data = await getWeather(city);
//     if(data != null) {
//       setWeatherData({
//         name: data.name,
//         country: data.sys.country,
//         description:data.weather[0].description.toUpperCase(),
//         temp:data.main.temp,
//         humidity:data.main.humidity,
//         wind:data.wind.speed,
//       })
//     }
//   }

//   useEffect(()=>{
//     const location = destination.split(",");
//     fetchWeather(location[0]);
//   },[])

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const bookingData = {
//       name,
//       destination,
//       tripStart: startDate,
//       tripEnd: endDate,
//       travelerCount: formData.travelerCount,
//       travelers: formData.travelers,
//       tripTypeId: formData.tripTypeId,
//       basePrice,
//       agencyCommission,
//       packageId
//     };
//     if(validateInput(formData)) {
//       const res = await newBooking(bookingData,customerId);
//       if(res != null){
//         navigate("/booking-confirmation", { state: { bookingNo: res.bookingNo }});
//       }
//     } else {
//       toast.error("please enter valid form data.");
//     }
//   };

//   const dateFormat = (date) => {
//     const data = new Date(date);
//     return `${data.getMonth() + 1}/${data.getDate()}/${data.getFullYear()}`;
//   }

//   return (
//     <motion.div
//       className="booking-container"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <Toaster position="top-center" />
//       <h2>Book: {name}</h2>
//       <p><strong>Destination:</strong> {destination}</p>
//       <p><strong>Trip Dates:</strong> {dateFormat(startDate)} to {dateFormat(endDate)}</p>
//       <p><strong>Trip Price:</strong> ${tripPrice}</p>
//       <p><strong>Total Price:</strong> ${totalPrice}</p>
//       <p><strong>Current Weather:</strong> {weatherData.description},  {weatherData.country}</p>
//       <p>🌡️ Temperature: {weatherData.temp}°C</p>
//       <p>💧 Humidity: {weatherData.humidity}%</p>
//       <p>💨 Wind Speed: {weatherData.wind} m/s</p>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="fullName"
//           placeholder="Booker's Name"
//           value={formData.fullName}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="number"
//           name="travelerCount"
//           placeholder="Number of Travelers,Maximum member will be 10"
//           min="1"
//           max="10"
//           value={formData.travelerCount}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="travelers"
//           placeholder="Please separate the customers' name by ,"
//           value={formData.travelers}
//           onChange={handleChange}
//           required
//         />

//         <label htmlFor="tripTypeId"><strong>Trip Type:</strong></label>
//         <select
//           name="tripTypeId"
//           value={formData.tripTypeId}
//           onChange={handleChange}
//           required
//         >
//           <option value="L">Leisure</option>
//           <option value="B">Business</option>
//           <option value="G">Group</option>
//         </select>

//         <button type="submit">Confirm Booking</button>
//         <button
//           type="button"
//           className="back-btn"
//           onClick={() => navigate(-1)}
//         >
//           ← Back to Package
//         </button>
//       </form>
//     </motion.div>
//   );
// };

// export default BookingPage;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { newBooking } from "../api/booking";
import { getWeather } from "../api/weather";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { validateName, validateMultipleName } from "../utils/validate";

const BACKEND_URL = "http://localhost:8080";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [bookingData, setBookingData] = useState(location.state || null);
  const [customerId, setCustomerId] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    travelers: "",
    travelerCount: 1,
    tripTypeId: "L"
  });

  useEffect(() => {
    if (!bookingData) {
      const stored = sessionStorage.getItem("bookingData");
      if (stored) {
        setBookingData(JSON.parse(stored));
      } else {
        navigate("/packages");
      }
    }
  }, [bookingData, navigate]);

  useEffect(() => {
    if (bookingData) {
      sessionStorage.removeItem("bookingData");
      const tripPrice = Number(bookingData.basePrice) + Number(bookingData.agencyCommission);
      setTotalPrice(tripPrice);
    }
  }, [bookingData]);

  const fetchCustomerId = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/${user.webUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCustomerId(data.customer.id);
    } catch {
      toast.error("Failed to load customer info");
    }
  };

  const fetchWeather = async (location) => {
    const data = await getWeather(location);
    if (data) {
      setWeatherData({
        name: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });
    }
  };

  useEffect(() => {
    if (user?.webUserId && token) fetchCustomerId();
  }, [user?.webUserId, token]);

  useEffect(() => {
    if (bookingData?.destination) {
      fetchWeather(bookingData.destination.split(",")[0]);
    }
  }, [bookingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "travelerCount") {
      const tripPrice = Number(bookingData.basePrice) + Number(bookingData.agencyCommission);
      setTotalPrice(tripPrice * Number(value));
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) return toast.error("Customer info not ready");
    if (!validateName(formData.fullName)) {
      return toast.error("please input valid name");
    }
    if(!validateMultipleName(formData.travelers)) {
      return toast.error("please input valid travelers");
    }

    const booking = {
      name: bookingData.name,
      destination: bookingData.destination,
      tripStart: bookingData.startDate,
      tripEnd: bookingData.endDate,
      travelerCount: formData.travelerCount,
      travelers: formData.travelers,
      tripTypeId: formData.tripTypeId,
      basePrice: bookingData.basePrice,
      agencyCommission: bookingData.agencyCommission,
      packageId: bookingData.packageId,
    };

    const res = await newBooking(booking, customerId);
    if (res) navigate("/booking-confirmation", { state: { bookingNo: res.bookingNo } });
  };

  const dateFormat = (date) => new Date(date).toLocaleDateString();

  if (!customerId || !bookingData) {
    return <div className="p-6 text-center text-gray-500">⏳ Loading booking form...</div>;
  }

  return (
    <motion.div className="max-w-3xl mx-auto px-4 py-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Toaster position="top-center" />
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Book: {bookingData.name}</h2>

      <div className="space-y-2 text-sm text-gray-700 mb-6">
        <p><strong>Destination:</strong> {bookingData.destination}</p>
        <p><strong>Trip Dates:</strong> {dateFormat(bookingData.startDate)} → {dateFormat(bookingData.endDate)}</p>
        <p><strong>Trip Price:</strong> ${Number(bookingData.basePrice) + Number(bookingData.agencyCommission)}</p>
        <p><strong>Total Price:</strong> ${totalPrice}</p>
        {weatherData.name && (
          <div className="bg-blue-50 p-3 rounded">
            <p><strong>Current Weather in {weatherData.name}, {weatherData.country}:</strong> {weatherData.description}</p>
            <p>🌡️ {weatherData.temp}°C | 💧 {weatherData.humidity}% | 💨 {weatherData.wind} m/s</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Booker's Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="travelerCount"
          placeholder="Number of Travelers"
          value={formData.travelerCount}
          onChange={handleChange}
          min="1"
          max="10"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="travelers"
          placeholder="Traveler Names (comma separated)"
          value={formData.travelers}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="font-semibold">Trip Type:</label>
          <select
            name="tripTypeId"
            value={formData.tripTypeId}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="L">Leisure</option>
            <option value="B">Business</option>
            <option value="G">Group</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Confirm Booking
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            ← Back to Package
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BookingPage;
