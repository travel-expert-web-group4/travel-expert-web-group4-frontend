import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopUpChart = ({ history }) => {
  if (!history || history.length === 0) return null;

  // Group by date
  const grouped = {};
  history.forEach((entry) => {
    const date = new Date(entry.date).toLocaleDateString();
    grouped[date] = (grouped[date] || 0) + entry.amount;
  });

  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Top-Up Amount ($)",
        data,
        backgroundColor: "#4caf50",
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => `$${val}`,
        },
      },
    },
  };

  return (
    <div className="chart-wrapper">
      <h4>📊 Top-Up Summary</h4>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default TopUpChart;
