import React from "react";
import "../styles/Testimonials.css";

// Import images correctly from `src/assets/images/`
import manImage from "../assets/images/man.jpeg";
import womanImage from "../assets/images/woman.jpeg";
import sampleWoman2Image from "../assets/images/samplewoman2.jpeg";

const Testimonials = () => {
    return (
        <section className="testimonials">
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="testimonials-container">
                <div className="testimonial-card">
                    <img src={manImage} alt="David Patel" className="testimonial-image" />
                    <h3>David Patel</h3>
                    <p>"Exceptional service! Travel Tales planned the perfect honeymoon for me!"</p>
                </div>
                <div className="testimonial-card">
                    <img src={womanImage} alt="Sophia Rodriguez" className="testimonial-image" />
                    <h3>Sophia Rodriguez</h3>
                    <p>"Their team helped me find a luxury resort in Dubai. Highly recommended!"</p>
                </div>
                <div className="testimonial-card">
                    <img src={sampleWoman2Image} alt="Rachel Lee" className="testimonial-image" />
                    <h3>Rachel Lee</h3>
                    <p>"From flights to hotels, they handled everything. 10/10 would book again!"</p>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
