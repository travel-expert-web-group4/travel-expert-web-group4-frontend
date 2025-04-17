


// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
// import { motion } from "framer-motion";
// import { useAuth } from "../contexts/AuthContext";
// import { getReview, reviewPackage } from "../api/package";

// const containerStyle = {
//   width: "100%",
//   height: "400px"
// };

// const libraries = ["places"];

// const getRelativeTime = (timestamp) => {
//   const now = new Date();
//   const past = new Date(timestamp);
//   const seconds = Math.floor((now - past) / 1000);

//   const units = [
//     { label: 'year', seconds: 31536000 },
//     { label: 'month', seconds: 2592000 },
//     { label: 'week', seconds: 604800 },
//     { label: 'day', seconds: 86400 },
//     { label: 'hour', seconds: 3600 },
//     { label: 'minute', seconds: 60 },
//     { label: 'second', seconds: 1 }
//   ];

//   for (let u of units) {
//     const count = Math.floor(seconds / u.seconds);
//     if (count > 0) {
//       return `${count} ${u.label}${count !== 1 ? 's' : ''} ago`;
//     }
//   }
//   return 'just now';
// };

// const PackageDetails = () => {
//   const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
//   const { state } = useLocation();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const {
//     packageId, name, description, destination,
//     imageUrl, rating, basePrice, agencyCommission,
//     startDate, endDate, lat, lng
//   } = state;

//   const parsedLat = parseFloat(lat);
//   const parsedLng = parseFloat(lng);
//   const isValidLatLng = !isNaN(parsedLat) && !isNaN(parsedLng);

//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: apiKey,
//     libraries
//   });

//   const [reviewSort, setReviewSort] = useState("highest");
//   const [showAllReviews, setShowAllReviews] = useState(false);
//   const reviewSectionRef = useRef(null);
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState({ rating: 5, review: "" });

//   const fetchReviews = async () => {
//     const reviewData = await getReview(packageId);
//     if (reviewData) setReviews(reviewData);
//   };

//   useEffect(() => { fetchReviews(); }, []);

//   useEffect(() => {
//     const storedReview = sessionStorage.getItem("pendingReview");
//     if (storedReview && user?.sub) {
//       const { review, rating, packageId: storedPackageId } = JSON.parse(storedReview);
//       if (storedPackageId === packageId) {
//         setNewReview({ rating, review });
//         reviewPackage({ rating, review }, packageId, user.sub).then(() => {
//           fetchReviews();
//           setNewReview({ rating: 5, review: "" });
//           sessionStorage.removeItem("pendingReview");
//         });
//       }
//     }
//   }, [user?.sub]);

//   const averageRating = reviews.length
//     ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
//     : "No reviews yet";

//   const handleInputChange = (e) => {
//     setNewReview({ ...newReview, [e.target.name]: e.target.value });
//   };

//   const handleSubmitReview = async (e) => {
//     e.preventDefault();
//     if (!user?.sub) {
//       sessionStorage.setItem("pendingReview", JSON.stringify({
//         review: newReview.review,
//         rating: Number(newReview.rating),
//         packageId
//       }));
//       navigate("/login");
//       return;
//     }
//     if (newReview.review) {
//       await reviewPackage(newReview, packageId, user.sub);
//       fetchReviews();
//       setNewReview({ rating: 5, review: "" });
//     }
//   };

//   const handleBookNow = () => {
//     const bookingData = {
//       packageId, name, basePrice, agencyCommission,
//       destination, startDate, endDate
//     };
//     sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
//     navigate(`/packages/${packageId}/book`, { state: bookingData });
//   };

//   return (
//     <motion.div className="px-4 py-8 max-w-5xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//       <h1 className="text-3xl font-bold mb-4">{name}</h1>
//       <img src={imageUrl} alt={name} className="w-full h-72 object-cover rounded-lg mb-6" />

//       <div className="space-y-2">
//         <p><strong>Destination:</strong> {destination}</p>
//         <p><strong>Description:</strong> {description}</p>
//         <p><strong>Dates:</strong> {startDate} → {endDate}</p>
//         <p><strong>Base Rating:</strong> ⭐ {rating}</p>
//         <p><strong>Customer Avg:</strong> ⭐ {averageRating} ({reviews.length} reviews)</p>
//         <p><strong>Price:</strong> ${basePrice}</p>
//         <p><strong>Commission:</strong> ${agencyCommission}</p>
//         <p><strong>Total:</strong> ${Number(basePrice) + Number(agencyCommission)}</p>
//       </div>

//       <button onClick={handleBookNow} className="mt-6 bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700">Book Now</button>

//       <h3 className="text-xl font-semibold mt-10 mb-2">Location on Map:</h3>
//       <div className="rounded overflow-hidden shadow mb-8 min-h-[400px] bg-gray-100 flex items-center justify-center">
//         {isLoaded && isValidLatLng ? (
//           <GoogleMap
//             mapContainerStyle={containerStyle}
//             center={{ lat: parsedLat, lng: parsedLng }}
//             zoom={10}
//           >
//             <Marker position={{ lat: parsedLat, lng: parsedLng }} />
//           </GoogleMap>
//         ) : (
//           <p className="text-gray-600 italic text-center p-4">
//             🗺️ Map unavailable: Missing or invalid coordinates.
//           </p>
//         )}
//       </div>

//       <hr className="my-6" />

//       <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
//       <div className="mb-4">
//         <label className="font-semibold mr-2">Sort Reviews:</label>
//         <select className="border px-2 py-1" value={reviewSort} onChange={(e) => setReviewSort(e.target.value)}>
//           <option value="highest">Highest Rating</option>
//           <option value="lowest">Lowest Rating</option>
//           <option value="newest">Newest First</option>
//           <option value="five-star">Only 5 Stars</option>
//           <option value="four-star">4 Stars & Up</option>
//         </select>
//       </div>

//       <ul ref={reviewSectionRef} className="space-y-4">
//         {reviews
//           .filter(r => {
//             if (reviewSort === "five-star") return r.rating === 5;
//             if (reviewSort === "four-star") return r.rating >= 4;
//             return true;
//           })
//           .sort((a, b) => {
//             if (reviewSort === "highest") return b.rating - a.rating;
//             if (reviewSort === "lowest") return a.rating - b.rating;
//             if (reviewSort === "newest") return new Date(b.timestamp) - new Date(a.timestamp);
//             return 0;
//           })
//           .slice(0, showAllReviews ? undefined : 3)
//           .map((r, i) => (
//             <li key={i} className="border p-3 rounded bg-gray-50">
//               <div className="text-sm text-gray-600">⭐ {r.rating}</div>
//               <p className="text-gray-800 italic">"{r.review}"</p>
//               <small className="text-xs text-gray-400">{r.timestamp ? getRelativeTime(r.timestamp) : ""}</small>
//             </li>
//           ))}
//       </ul>

//       {reviews.length > 3 && (
//         <button
//           onClick={() => setShowAllReviews(prev => !prev)}
//           className="mt-4 bg-gray-100 border px-4 py-2 rounded hover:bg-gray-200"
//         >
//           {showAllReviews ? "Show Less" : "Show All Reviews"}
//         </button>
//       )}

//       <h3 className="text-xl font-semibold mt-10">Leave a Review</h3>
//       <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
//         <select name="rating" value={newReview.rating} onChange={handleInputChange} className="border p-2 rounded w-full">
//           <option value={5}>5 - Excellent</option>
//           <option value={4}>4 - Great</option>
//           <option value={3}>3 - Good</option>
//           <option value={2}>2 - Fair</option>
//           <option value={1}>1 - Poor</option>
//         </select>
//         <textarea
//           name="review"
//           placeholder="Your review..."
//           value={newReview.review}
//           onChange={handleInputChange}
//           required
//           rows="4"
//           className="w-full border rounded p-2"
//         />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Review</button>
//       </form>
//     </motion.div>
//   );
// };

// export default PackageDetails;


import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { getReview, reviewPackage } from "../api/package";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const libraries = ["places"];

const getRelativeTime = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const seconds = Math.floor((now - past) / 1000);

  const units = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (let u of units) {
    const count = Math.floor(seconds / u.seconds);
    if (count > 0) {
      return `${count} ${u.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
};

const PackageDetails = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    packageId, name, description, destination,
    imageUrl, rating, basePrice, agencyCommission,
    startDate, endDate, lat, lng
  } = state;

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const isValidLatLng = !isNaN(parsedLat) && !isNaN(parsedLng);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries
  });

  const [geoCoords, setGeoCoords] = useState(null);
  const [reviewSort, setReviewSort] = useState("highest");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviewSectionRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, review: "" });

  const fetchReviews = async () => {
    const reviewData = await getReview(packageId);
    if (reviewData) setReviews(reviewData);
  };

  useEffect(() => { fetchReviews(); }, []);

  useEffect(() => {
    const storedReview = sessionStorage.getItem("pendingReview");
    if (storedReview && user?.sub) {
      const { review, rating, packageId: storedPackageId } = JSON.parse(storedReview);
      if (storedPackageId === packageId) {
        setNewReview({ rating, review });
        reviewPackage({ rating, review }, packageId, user.sub).then(() => {
          fetchReviews();
          setNewReview({ rating: 5, review: "" });
          sessionStorage.removeItem("pendingReview");
        });
      }
    }
  }, [user?.sub]);

  useEffect(() => {
    if (!isValidLatLng && isLoaded && destination) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: destination }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          setGeoCoords({ lat: location.lat(), lng: location.lng() });
        } else {
          console.warn("Geocoding failed:", status);
        }
      });
    }
  }, [isLoaded, destination, isValidLatLng]);

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
    : "No reviews yet";

  const handleInputChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user?.sub) {
      sessionStorage.setItem("pendingReview", JSON.stringify({
        review: newReview.review,
        rating: Number(newReview.rating),
        packageId
      }));
      navigate("/login");
      return;
    }
    if (newReview.review) {
      await reviewPackage(newReview, packageId, user.sub);
      fetchReviews();
      setNewReview({ rating: 5, review: "" });
    }
  };

  const handleBookNow = () => {
    const bookingData = {
      packageId, name, basePrice, agencyCommission,
      destination, startDate, endDate
    };
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    navigate(`/packages/${packageId}/book`, { state: bookingData });
  };

  return (
    <motion.div className="px-4 py-8 max-w-5xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <img src={imageUrl} alt={name} className="w-full h-72 object-cover rounded-lg mb-6" />

      <div className="space-y-2">
        <p><strong>Destination:</strong> {destination}</p>
        <p><strong>Description:</strong> {description}</p>
        <p><strong>Dates:</strong> {startDate} → {endDate}</p>
        <p><strong>Base Rating:</strong> ⭐ {rating}</p>
        <p><strong>Customer Avg:</strong> ⭐ {averageRating} ({reviews.length} reviews)</p>
        <p><strong>Price:</strong> ${basePrice}</p>
        <p><strong>Commission:</strong> ${agencyCommission}</p>
        <p><strong>Total:</strong> ${Number(basePrice) + Number(agencyCommission)}</p>
      </div>

      <button onClick={handleBookNow} className="mt-6 bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700">Book Now</button>

      <h3 className="text-xl font-semibold mt-10 mb-2">Location on Map:</h3>
      <div className="rounded overflow-hidden shadow mb-8 min-h-[400px] bg-gray-100 flex items-center justify-center">
        {isLoaded && (isValidLatLng || geoCoords) ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={isValidLatLng ? { lat: parsedLat, lng: parsedLng } : geoCoords}
            zoom={10}
          >
            <Marker position={isValidLatLng ? { lat: parsedLat, lng: parsedLng } : geoCoords} />
          </GoogleMap>
        ) : (
          <p className="text-gray-600 italic text-center p-4">
            🗺️ Map unavailable: Location could not be determined.
          </p>
        )}
      </div>

      <hr className="my-6" />

      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="mb-4">
        <label className="font-semibold mr-2">Sort Reviews:</label>
        <select className="border px-2 py-1" value={reviewSort} onChange={(e) => setReviewSort(e.target.value)}>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
          <option value="newest">Newest First</option>
          <option value="five-star">Only 5 Stars</option>
          <option value="four-star">4 Stars & Up</option>
        </select>
      </div>

      <ul ref={reviewSectionRef} className="space-y-4">
        {reviews
          .filter(r => {
            if (reviewSort === "five-star") return r.rating === 5;
            if (reviewSort === "four-star") return r.rating >= 4;
            return true;
          })
          .sort((a, b) => {
            if (reviewSort === "highest") return b.rating - a.rating;
            if (reviewSort === "lowest") return a.rating - b.rating;
            if (reviewSort === "newest") return new Date(b.timestamp) - new Date(a.timestamp);
            return 0;
          })
          .slice(0, showAllReviews ? undefined : 3)
          .map((r, i) => (
            <li key={i} className="border p-3 rounded bg-gray-50">
              <div className="text-sm text-gray-600">⭐ {r.rating}</div>
              <p className="text-gray-800 italic">"{r.review}"</p>
              <small className="text-xs text-gray-400">{r.timestamp ? getRelativeTime(r.timestamp) : ""}</small>
            </li>
          ))}
      </ul>

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAllReviews(prev => !prev)}
          className="mt-4 bg-gray-100 border px-4 py-2 rounded hover:bg-gray-200"
        >
          {showAllReviews ? "Show Less" : "Show All Reviews"}
        </button>
      )}

      <h3 className="text-xl font-semibold mt-10">Leave a Review</h3>
      <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
        <select name="rating" value={newReview.rating} onChange={handleInputChange} className="border p-2 rounded w-full">
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Great</option>
          <option value={3}>3 - Good</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
        <textarea
          name="review"
          placeholder="Your review..."
          value={newReview.review}
          onChange={handleInputChange}
          required
          rows="4"
          className="w-full border rounded p-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Submit Review</button>
      </form>
    </motion.div>
  );
};

export default PackageDetails;

