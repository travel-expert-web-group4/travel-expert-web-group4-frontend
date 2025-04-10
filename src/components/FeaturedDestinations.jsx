import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import destination1 from "../assets/images/destination1.jpg";
import destination2 from "../assets/images/destination2.jpg";
import destination3 from "../assets/images/destination3.jpg";
import destination4 from "../assets/images/destination4.jpg";
import destination5 from "../assets/images/destination5.jpg";
import destination6 from "../assets/images/destination6.jpg";

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
    >
      <FaArrowLeft className="text-gray-700" />
    </button>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
    >
      <FaArrowRight className="text-gray-700" />
    </button>
  );
};

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
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1, dots: true } },
      { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ]
  };

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white" id="featured">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">🌍 Featured Destinations</h2>
      <div className="relative max-w-7xl mx-auto px-4">
        <Slider {...settings}>
          {destinations.map((destination) => (
            <div key={destination.id} className="px-3">
              <div className="rounded-xl overflow-hidden shadow-md relative group">
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                <div className="absolute bottom-0 p-4 z-20 text-white">
                  <h3 className="text-xl font-semibold mb-1">{destination.title}</h3>
                  <p className="text-sm opacity-90 mb-3">{destination.description}</p>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-full shadow-md transition">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
