import React from "react";
import "../styles/AboutUs.css"; // Ensure you create this CSS file
import aboutImage from "../assets/images/about-us.jpg"; // Import an image

const AboutUs = () => {
    return (
        <section className="about-section">
            <div className="about-container">
                <div className="about-text">
                    <h2>About Travel Tales</h2>
                    <p>
                        Travel Tales is your trusted partner in creating unforgettable journeys.
                        We offer carefully crafted travel experiences tailored to your unique needs,
                        ensuring each trip is filled with discovery, adventure, and cherished memories.
                    </p>
                </div>
                <div className="about-image">
                    <img src={aboutImage} alt="About Travel Tales" />
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
