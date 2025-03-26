import React, { useState, useEffect } from "react";
import TopUpChart from "../components/TopUpChart";

import "../styles/WalletPage.css";

const WalletPage = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [history, setHistory] = useState([]);

//   useEffect(() => {
//     const storedBalance = localStorage.getItem("walletBalance");
//     const storedHistory = JSON.parse(localStorage.getItem("walletTopUpHistory")) || [];

//     if (storedBalance) setWalletBalance(Number(storedBalance));
//     setHistory(storedHistory);
//   }, []);

useEffect(() => {
    const storedBalance = localStorage.getItem("walletBalance");
    if (storedBalance) setWalletBalance(Number(storedBalance));
  
    fetch("/mockWalletHistory.json")
      .then(res => res.json())
      .then(data => setHistory(data));
  }, []);

  const handleTopUp = () => {
    const topUpAmount = parseFloat(amount);
    if (isNaN(topUpAmount) || topUpAmount <= 0) return;

    const updated = walletBalance + topUpAmount;
    const newTopUp = {
      amount: topUpAmount,
      date: new Date().toISOString()
    };

    const updatedHistory = [newTopUp, ...history];

    setWalletBalance(updated);
    setHistory(updatedHistory);
    setAmount("");
    setSuccessMessage(`Wallet topped up by $${topUpAmount.toFixed(2)}!`);

    // Save to localStorage
    localStorage.setItem("walletBalance", updated);
    localStorage.setItem("walletTopUpHistory", JSON.stringify(updatedHistory));

    setTimeout(() => setSuccessMessage(""), 2500);
  };

  return (
    <div className="wallet-container">
      <h2>💼 My Wallet</h2>
      <p className="wallet-balance"><strong>Current Balance:</strong> ${walletBalance.toFixed(2)}</p>

      <input
        type="number"
        placeholder="Enter amount to top up"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleTopUp}>Top Up Wallet</button>
      {successMessage && <p className="success">{successMessage}</p>}

      {history.length > 0 && (
        <div className="topup-history">
          <h4>🕘 Top-Up History</h4>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                +${entry.amount.toFixed(2)} on {new Date(entry.date).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
        )}
        <TopUpChart history={history} />

    </div>
  );
};

export default WalletPage;
