import React, { useEffect, useState } from "react";
import TopUpChart from "../components/TopUpChart";
import "../styles/DashboardPage.css";

const DashboardPage = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const [topUpHistory, setTopUpHistory] = useState([]);

//   useEffect(() => {
//     const balance = localStorage.getItem("walletBalance");
//     if (balance) setWalletBalance(Number(balance));

//     const bookings = JSON.parse(localStorage.getItem("myBookings")) || [];
//     setBookingCount(bookings.length);
//     setRecentBookings(bookings.slice(0, 3));

//     const history = JSON.parse(localStorage.getItem("walletTopUpHistory")) || [];
//     setTopUpHistory(history);
//   }, []);
useEffect(() => {
    fetch("/mockDashboardData.json")
      .then(res => res.json())
      .then(data => {
        setWalletBalance(data.walletBalance);
        setTopUpHistory(data.topUpHistory);
        setRecentBookings(data.bookings.slice(0, 3));
        setBookingCount(data.bookings.length);
        // Optional: setPopularDestinations(data.popularDestinations);
      });
  }, []);
  

  return (
    <div className="dashboard-container">
      <h2>📊 Dashboard Overview</h2>

      <div className="summary-cards">
        <div className="card wallet">
          <h4>💼 Wallet Balance</h4>
          <p>${walletBalance.toFixed(2)}</p>
        </div>

        <div className="card bookings">
          <h4>📦 Total Bookings</h4>
          <p>{bookingCount}</p>
        </div>
      </div>

      <TopUpChart history={topUpHistory} />

      <div className="recent-bookings">
        <h4>🕘 Recent Bookings</h4>
        {recentBookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <ul>
            {recentBookings.map((b, i) => (
              <li key={i}>
                <strong>{b.name}</strong> — {b.destination} <br />
                <small>{new Date(b.savedAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
