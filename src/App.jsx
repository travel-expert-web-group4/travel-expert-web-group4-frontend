import React from "react";
import AppRoutes from "./routes.jsx";
import Navbar from "./components/Navbar.jsx";
import HeroSection from "./components/HeroSection.jsx";
import AboutUs from "./components/AboutUs.jsx";
import FeaturedDestinations from "./components/FeaturedDestinations.jsx";
import Services from "./components/Services.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Footer from "./components/Footer.jsx";


const App = () => {
    return (
        <>
            <Navbar />
            <HeroSection />
            <AboutUs />
            <FeaturedDestinations />
            <Services />
            <Testimonials />
            <Footer />
        </>
    );
};

export default App;
