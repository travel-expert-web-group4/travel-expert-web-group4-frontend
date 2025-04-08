import React from "react";
import HeroSection from "../components/HeroSection";

import FeaturedDestinations from "../components/FeaturedDestinations";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <>
      <HeroSection />
      {/* <AboutUs /> */}
      <FeaturedDestinations />
      <Services />
      <Testimonials />
    </>
  );
};

export default Home;
