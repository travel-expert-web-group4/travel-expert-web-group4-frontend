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


// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useAuth } from "../contexts/AuthContext";
// import { bookingDetail } from "../api/booking";
// import { checkOutBill } from "../api/payment";

// const PaymentPage = () => {
//   const { state } = useLocation();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [processing, setProcessing] = useState(false);
//   const [bookingData, setBookingData] = useState(null);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [discountLabel, setDiscountLabel] = useState("0%");
//   const [priceAfterDiscountPerPerson, setPriceAfterDiscountPerPerson] = useState(0);

//   if (!state || !state.bookingNo) return <p>No payment info found.</p>;
//   const { bookingNo } = state;

//   const getUserDiscountInfo = (user) => {
//     let baseDiscount = 0;
//     let labels = [];

//     const typeId = user?.customer?.customerType?.id || user?.customer?.customer_type_id;
//     const role = user?.role?.toLowerCase();

//     const customerTypeMap = {
//       1: { name: "Bronze", discount: 0.15 },
//       2: { name: "Platinum", discount: 0.10 },
//       3: { name: "Guest", discount: 0.0 },
//     };

//     const typeData = customerTypeMap[typeId];
//     if (typeData) {
//       baseDiscount = typeData.discount;
//       if (typeData.name !== "Guest") {
//         labels.push(`${typeData.discount * 100}% ${typeData.name}`);
//       }
//     }

//     if (role === "agent" || role === "role_agent") {
//       baseDiscount += 0.10;
//       labels.push("10% Agent");
//     }

//     return { discountMultiplier: 1 - baseDiscount, labels };
//   };

//   useEffect(() => {
//     const fetchDetails = async () => {
//       const data = await bookingDetail(bookingNo);
//       if (data) {
//         setBookingData(data);
//         const { discountMultiplier, labels } = getUserDiscountInfo(user);

//         const fullPricePerPerson = Number(data.basePrice) + Number(data.agencyCommission);
//         const discountedPricePerPerson = fullPricePerPerson * discountMultiplier;

//         setPriceAfterDiscountPerPerson(discountedPricePerPerson);
//         setTotalPrice(discountedPricePerPerson * Number(data.travelerCount));
//         setDiscountLabel(labels.length > 0 ? labels.join(" + ") : "0%");
//       }
//     };
//     fetchDetails();
//   }, [bookingNo, user]);

//   const handlePay = async () => {
//     if (!bookingData) return;
//     setProcessing(true);
//     const res = await checkOutBill(bookingData);
//     if (res?.sessionUrl) {
//       window.location.href = res.sessionUrl;
//     }
//     setProcessing(false);
//   };

//   if (!bookingData) return <p className="text-center py-10 text-gray-600">Loading booking details...</p>;

//   const { name, destination, basePrice, agencyCommission, travelerCount } = bookingData;
//   const fullPricePerPerson = Number(basePrice) + Number(agencyCommission);

//   return (
//     <motion.div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//       <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
//         <span role="img" aria-label="card">💳</span> Payment for Booking <span className="text-blue-800">#{bookingNo}</span>
//       </h2>

//       <div className="space-y-2 text-sm text-gray-800 mb-4">
//         <p><strong className="text-gray-700">📦 Package:</strong> {name}</p>
//         <p><strong className="text-gray-700">📍 Destination:</strong> {destination}</p>
//         <p><strong className="text-gray-700">👥 Travelers:</strong> {travelerCount}</p>
//       </div>

//       <div className="bg-gray-100 rounded p-4 text-sm mb-6">
//         <p><strong>Base Price / person:</strong> ${Number(basePrice).toFixed(2)}</p>
//         <p><strong>Agency Commission / person:</strong> ${Number(agencyCommission).toFixed(2)}</p>
//         <p><strong>Discount Applied:</strong> {discountLabel}</p>
//         <p><strong>Price after Discount / person:</strong> ${priceAfterDiscountPerPerson.toFixed(2)}</p>
//         <p><strong>Traveler Count:</strong> {travelerCount}</p>
//         <hr className="my-2" />
//         <p className="text-green-700 font-bold text-lg">Total Payable: ${totalPrice.toFixed(2)}</p>
//       </div>

//       <div className="flex gap-4">
//         <button onClick={handlePay} disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
//           {processing ? "Processing..." : "Pay Now"}
//         </button>
//         <button onClick={() => navigate('/my-bookings')} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded">
//           Pay it later
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default PaymentPage;