import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { motion } from "framer-motion";
import "../styles/PackageDetails.css";
import { getReview, reviewPackage } from "../api/package";

const containerStyle = {
  width: "100%",
  height: "400px"
};

// Utility: Convert timestamp to relative time
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
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    packageId,
    name,
    description,
    destination,
    imageUrl,
    rating,
    basePrice,
    agencyCommission,
    startDate,
    endDate,
    lat,
    lng
  } = state;

  const [reviewSort, setReviewSort] = useState("highest");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviewSectionRef = useRef(null);

  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const reviewData = await getReview(packageId);
    if (reviewData != null) {
      setReviews(reviewData);
    }
  };

  useEffect(()=>{
    fetchReviews();
  },[])

  const [newReview, setNewReview] = useState({
    rating: 5,
    review: ""
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
    : "No reviews yet";

  const handleInputChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.review) {
      const customer = JSON.parse(localStorage.getItem("customer"));
      await reviewPackage(newReview,packageId,customer.email);
      fetchReviews();
      // localStorage.setItem(`reviews-${packageId}`, JSON.stringify(updated));
      setNewReview({  rating: 5, review: "" });
    }
  };

  return (
    <motion.div
      className="package-details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1>{name}</h1>
      <img src={imageUrl} alt={name} />

      <p><strong>Destination:</strong> {destination}</p>
      <p><strong>Description:</strong> {description}</p>
      <p><strong>Start Date:</strong> {startDate}</p>
      <p><strong>End Date:</strong> {endDate}</p>
      <p><strong>Base Rating:</strong> ⭐ {rating}</p>
      <p><strong>Customer Avg Rating:</strong> ⭐ {averageRating} ({reviews.length} reviews)</p>
      <p><strong>Price:</strong> ${basePrice}</p>
      <p><strong>Agency Commission:</strong> ${agencyCommission}</p>
      <p><strong>Total:</strong> ${Number(basePrice) + Number(agencyCommission)}</p>

      <button
        onClick={() => navigate(`/packages/${packageId}/book`, { state })}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          marginTop: "1rem",
          cursor: "pointer"
        }}
      >
        Book Now
      </button>

      <h3 style={{ marginTop: "2rem" }}>Location on Map:</h3>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap mapContainerStyle={containerStyle} center={{ lat, lng }} zoom={10}>
          <Marker position={{ lat, lng }} />
        </GoogleMap>
      </LoadScript>

      <hr />

      <h2>Customer Reviews</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="sortReviews"><strong>Sort Reviews:</strong></label>
        <select
          id="sortReviews"
          value={reviewSort}
          onChange={(e) => setReviewSort(e.target.value)}
          style={{ marginLeft: "0.5rem", padding: "0.3rem" }}
        >
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
          <option value="newest">Newest First</option>
          <option value="five-star">Only 5 Stars</option>
          <option value="four-star">4 Stars & Up</option>
        </select>
      </div>

      <ul ref={reviewSectionRef}>
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
            <li key={i}>
              <strong>***</strong> - ⭐ {r.rating}<br />
              <em>{r.review}</em><br />
              <small style={{ color: "#666" }}>
                {r.timestamp ? getRelativeTime(r.timestamp) : ""}
              </small>
            </li>
          ))}
      </ul>

      {reviews.length > 3 && (
        <button
          onClick={() => {
            if (showAllReviews && reviewSectionRef.current) {
              reviewSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            setShowAllReviews(prev => !prev);
          }}
          style={{
            marginTop: "1rem",
            backgroundColor: "#eee",
            color: "#333",
            border: "1px solid #ccc",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          {showAllReviews ? "Show Less" : "Show All Reviews"}
        </button>
      )}

      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmitReview}>
        <select
          name="rating"
          value={newReview.rating}
          onChange={handleInputChange}
        >
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
        />
        <button type="submit">Submit Review</button>
      </form>
    </motion.div>
  );
};

export default PackageDetails;
