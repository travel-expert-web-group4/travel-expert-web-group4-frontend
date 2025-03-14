import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HeroSection.css";

// Import images correctly from `src/assets/images/`
import destination1 from "../assets/images/destination1.jpg";
import destination2 from "../assets/images/destination2.jpg";
import destination3 from "../assets/images/destination3.jpg";
import destination4 from "../assets/images/destination4.jpg";

const HeroSection = () => {
    const images = [destination1, destination2, destination3, destination4];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        fade: true,
        arrows: false,
    };

    return (
        <section className="hero-section">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="hero-slide">
                        <img
                            src={image}
                            alt={`Destination ${index + 1}`}
                            className="hero-image"
                        />
                    </div>
                ))}
            </Slider>
            <div className="hero-content">
                <h1 className="hero-title">Discover Your Next Adventure</h1>
            </div>
        </section>
    );
};

export default HeroSection;
