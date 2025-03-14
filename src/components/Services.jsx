import React from "react";
import "../styles/Services.css";

// Import images from `src/assets/images/`
import planeIcon from "../assets/images/plane.png";
import hotelIcon from "../assets/images/hotel.png";
import tourGuideIcon from "../assets/images/tour-guide.png";

const Services = () => {
    return (
        <section className="services">
            <h2 className="section-title">Our Services</h2>
            <div className="services-container">
                <div className="service-card">
                    <img src={planeIcon} alt="Flight Reservation" className="service-icon" />
                    <h3>Flight Reservation</h3>
                    <p>Book domestic and international flights with ease.</p>
                </div>
                <div className="service-card">
                    <img src={hotelIcon} alt="Hotel Reservation" className="service-icon" />
                    <h3>Hotel Reservation</h3>
                    <p>Find and book the best accommodations worldwide.</p>
                </div>
                <div className="service-card">
                    <img src={tourGuideIcon} alt="Tour Guide" className="service-icon" />
                    <h3>Tour Guide</h3>
                    <p>Explore new destinations with expert guides.</p>
                </div>
            </div>
        </section>
    );
};

export default Services;
