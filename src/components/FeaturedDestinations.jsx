import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/FeaturedDestinations.css";

// Import images explicitly
import destination1 from "../assets/images/destination1.jpg";
import destination2 from "../assets/images/destination2.jpg";
import destination3 from "../assets/images/destination3.jpg";
import destination4 from "../assets/images/destination4.jpg";
import destination5 from "../assets/images/destination5.jpg";
import destination6 from "../assets/images/destination6.jpg";

const FeaturedDestinations = () => {
    const destinations = [
        { id: 1, image: destination1, title: "Exotic Beach Getaway", description: "Experience paradise on Earth" },
        { id: 2, image: destination2, title: "Mountain Adventure", description: "Conquer new heights" },
        { id: 3, image: destination3, title: "Cultural Exploration", description: "Immerse yourself in rich traditions" },
        { id: 4, image: destination4, title: "Urban Escape", description: "Discover the vibrant city life" },
        { id: 5, image: destination5, title: "Historical Journey", description: "Step back in time" },
        { id: 6, image: destination6, title: "Tropical Paradise", description: "Relax in stunning tropical settings" }
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Show 3 slides on large screens
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1, dots: true } },
            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }
        ]
    };

    return (
        <section className="featured-destinations">
            <h2 className="section-title">Featured Destinations</h2>
            <Slider {...settings}>
                {destinations.map((destination) => (
                    <div key={destination.id} className="destination-card">
                        <div className="image-container">
                            <img src={destination.image} alt={destination.title} className="destination-image" />
                            <div className="image-overlay"></div>
                        </div>
                        <h3>{destination.title}</h3>
                        <p>{destination.description}</p>
                        <button className="cta-button">Learn More</button>
                    </div>
                ))}
            </Slider>
        </section>
    );
};

export default FeaturedDestinations;
