import { useEffect, useState } from "react";

const WelcomeBanner = () => {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("welcomeMessage");
    if (stored) {
      setMessage(stored);
      localStorage.removeItem("welcomeMessage");

      // Start fading after 4s, hide after 5s
      const fadeTimer = setTimeout(() => setFading(true), 4000);
      const hideTimer = setTimeout(() => setVisible(false), 5000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  const handleClose = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 500); // short delay to complete fade
  };

  if (!message || !visible) return null;

  return (
    <div
      className={`relative bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4 shadow-md transition-opacity duration-700 ease-in-out ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <strong>{message}</strong>
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-green-800 hover:text-red-500 text-lg font-bold focus:outline-none"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default WelcomeBanner;
