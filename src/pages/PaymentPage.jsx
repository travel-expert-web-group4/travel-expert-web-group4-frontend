// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import "../styles/PaymentPage.css";
// import { bookingDetail } from "../api/booking";
// import { checkOutBill } from "../api/payment";
// import { useAuth } from "../contexts/AuthContext";


// const PaymentPage = () => {
//   const { state } = useLocation();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   if (!state) return <p>No payment info found.</p>;

//   const { bookingNo } = state;

//   // const [walletBalance, setWalletBalance] = useState(2000);
//   const [processing, setProcessing] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [canAfford, setCanAfford] = useState(true);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [bookingData, setBookingData] = useState({
//     bookingNo: "",
//     agencyCommission: "",
//     basePrice: "",
//     destination: "",
//     name: "",
//     savedAt: "",
//     travelerCount: 0,
//     travelers: "",
//     tripEnd: "",
//     tripStart: "",
//     tripTypeId: "",
//   });

//   const calculateDiscount = (point) => {
//     if(point < 5000) {
//       return 1;
//     } else if(point >= 5000 && point < 20000) {
//       return 0.85;
//     } else if(point >= 20000) {
//       return 0.9;
//     }
//   }
//   const getDetail = async (bookingNo) => {
//     const discount = calculateDiscount(user.points);
//     const data = await bookingDetail(bookingNo);
//     if (data != null) {
//       setBookingData({...data,agencyCommission:data.agencyCommission*discount,basePrice:data.basePrice*discount});
//       setTotalPrice((data.basePrice + data.agencyCommission)*data.travelerCount * discount);
//     }
//   };

//   useEffect(() => {
//     getDetail(bookingNo);
//   }, []);

//   // useEffect(() => {
//   //   setCanAfford(walletBalance >= totalPrice);
//   // }, [walletBalance, totalPrice]);

//   const handlePay = async (e) => {
//     e.preventDefault();

//     setProcessing(true);
//     const res = await checkOutBill(bookingData);
//     if(res != null) {
//       location.href = res.sessionUrl;
//     }
//     setProcessing(false);
//   };

//   return (
//     <motion.div
//       className="payment-container"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h2>Payment for Booking #{bookingData.bookingNo}</h2>
//       <p>
//         <strong>Package:</strong> {bookingData.name}
//       </p>
//       <p>
//         <strong>Destination:</strong> {bookingData.destination}
//       </p>
//       <p>
//         <strong>Travelers:</strong> {bookingData.travelerCount}
//       </p>
//       <p>
//         <strong>Total to Pay:</strong> ${totalPrice}
//       </p>
//       {/* <p>
//         <strong>Your Wallet Balance:</strong> ${walletBalance}
//       </p>

//       {!canAfford && (
//         <p className="error-text">
//           Insufficient funds! You need more money to complete this booking.
//         </p>
//       )} */}

//         <button onClick={handlePay} disabled={processing || !canAfford}>
//           {processing ? (
//             <>
//               <span className="spinner"></span> Processing...
//             </>
//           ) : (
//             "Pay Now"
//           )}
//         </button>
//         <button className="later" onClick={() => navigate(`/my-bookings`)}>
//           Pay it later
//         </button>
//       {success && (
//         <motion.div
//           className="success-message"
//           initial={{ scale: 0.8, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.4 }}
//         >
//           ✅ Payment Successful!
//         </motion.div>
//       )}
//     </motion.div>
//   );
// };

// export default PaymentPage;





import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { bookingDetail } from "../api/booking";
import { checkOutBill } from "../api/payment";
import { getUserById } from "../api/user";

const CustomerRegistration = () => {
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountLabel, setDiscountLabel] = useState("0%");
  const [discount,setDiscount] = useState(1);
  const [priceAfterDiscountPerPerson, setPriceAfterDiscountPerPerson] = useState(0);

  if (!state || !state.bookingNo) return <p>No payment info found.</p>;
  const { bookingNo } = state;

  const getUserDiscountInfo = async (user) => {
    let baseDiscount = 0;
    let labels = [];

    const userDetail = await getUserById(user.webUserId);
  
    if (userDetail.points >= 5000 && userDetail.points < 20000) {
      baseDiscount = 0.15;
      labels.push("15% Bronze");
    } else if (userDetail.points >= 20000) {
      baseDiscount = 0.10;
      labels.push("10% Platinum");
    }
  
    if (userDetail.agent) {
      baseDiscount += 0.10;
      labels.push("10% Agent");
    }
  
    return {
      discountMultiplier: 1 - baseDiscount,
      labels: labels.length ? labels : ["0%"],
    };
  };
  
  
  useEffect(() => {
    console.log("✅ user object for discount check:", user);

    const fetchDetails = async () => {
      const data = await bookingDetail(bookingNo);
      if (data) {
        setBookingData(data);
        const { discountMultiplier, labels } = await getUserDiscountInfo(user);
        setDiscount(discountMultiplier);

        const fullPricePerPerson = Number(data.basePrice) + Number(data.agencyCommission);
        const discountedPricePerPerson = fullPricePerPerson * discountMultiplier;

        setPriceAfterDiscountPerPerson(discountedPricePerPerson);
        setTotalPrice(discountedPricePerPerson * Number(data.travelerCount));
        setDiscountLabel(labels.length > 0 ? labels.join(" + ") : "0%");
      }
    };
    fetchDetails();
  }, [bookingNo, user]);

  const handlePay = async () => {
    if (!bookingData) return;
    setProcessing(true);
    const res = await checkOutBill({...bookingData,basePrice: bookingData.basePrice * discount,agencyCommission: bookingData.agencyCommission * discount});
    if (res?.sessionUrl) {
      window.location.href = res.sessionUrl;
    }
    setProcessing(false);
  };

  if (!bookingData) return <p className="text-center py-10 text-gray-600">Loading booking details...</p>;

  const { name, destination, basePrice, agencyCommission, travelerCount } = bookingData;
  const fullPricePerPerson = Number(basePrice) + Number(agencyCommission);

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full p-10 border rounded-xl shadow-md bg-white">
        <Toaster position="top-center" />
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700 font-sans">
          New Customer Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="flex gap-4">
              {["custFirstName", "custLastName"].map((field, i) => (
                <div key={field} className="w-1/2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {i === 0 ? "First Name" : "Last Name"}
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      required
                      className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                  {errors[field] && <p className="text-sm text-red-600 mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>

            {/* Email */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="custEmail"
                value={formData.custEmail}
                onChange={handleChange}
                required
                className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {errors.custEmail && <p className="text-sm text-red-600 mt-1">{errors.custEmail}</p>}

            {/* Phone */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number <span className="text-gray-400 text-xs">(e.g., 403-123-4567)</span>
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="custPhone"
                value={formData.custPhone}
                onChange={handleChange}
                required
                className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {errors.custPhone && <p className="text-sm text-red-600 mt-1">{errors.custPhone}</p>}

            {/* Street Address */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Street Address <span className="text-gray-400 text-xs">(e.g., 301 8 Ave SW)</span>
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                id="custAddress"
                name="custAddress"
                value={formData.custAddress}
                onChange={handleChange}
                required
                className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {errors.custAddress && (
              <p className="text-sm text-red-600 mt-1">{errors.custAddress}</p>
            )}

            {/* City + Province */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                <div className="relative">
                  <FaCity className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="custCity"
                    value={formData.custCity}
                    onChange={handleChange}
                    required
                    className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                {errors.custCity && <p className="text-sm text-red-600 mt-1">{errors.custCity}</p>}
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Province (e.g., AB)
                </label>
                <select
                  name="custProvince"
                  value={formData.custProvince}
                  onChange={handleChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select Province</option>
                  <option value="AB">Alberta</option>
                  <option value="BC">British Columbia</option>
                  <option value="MB">Manitoba</option>
                  <option value="NB">New Brunswick</option>
                  <option value="NL">Newfoundland and Labrador</option>
                  <option value="NS">Nova Scotia</option>
                  <option value="NT">Northwest Territories</option>
                  <option value="NU">Nunavut</option>
                  <option value="ON">Ontario</option>
                  <option value="PE">Prince Edward Island</option>
                  <option value="QC">Quebec</option>
                  <option value="SK">Saskatchewan</option>
                  <option value="YT">Yukon</option>
                </select>
                {errors.custProvince && (
                  <p className="text-sm text-red-600 mt-1">{errors.custProvince}</p>
                )}
              </div>
            </div>

            {/* Postal + Country */}
            <div className="flex gap-3">
            <div className="w-1/2">
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    Postal Code <span className="text-gray-400 text-xs">(e.g., T5S 0E6)</span>
  </label>
  <input
    type="text"
    name="custPostal"
    value={formData.custPostal}
    onChange={(e) =>
      handleChange({
        target: {
          name: "custPostal",
          value: e.target.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .replace(/(.{3})(.{1,3})/, "$1 $2"),
        },
      })
    }
    required
    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
  />
  {errors.custPostal && (
    <p className="text-sm text-red-600 mt-1">{errors.custPostal}</p>
  )}
</div>

              <div className="w-1/2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                <div className="relative">
                  <FaGlobe className="absolute left-3 top-3 text-gray-400" />
                  <select
                    name="custCountry"
                    value={formData.custCountry}
                    onChange={handleChange}
                    required
                    className="w-full border px-10 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select Country</option>
                    <option value="CA">Canada</option>
                    <option value="US">United States</option>
                  </select>
                </div>
                {errors.custCountry && (
                  <p className="text-sm text-red-600 mt-1">{errors.custCountry}</p>
                )}
              </div>
            </div>
          </motion.div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              <FaArrowLeft /> Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              {submitting ? "Submitting..." : "Submit Customer Info"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerRegistration;



