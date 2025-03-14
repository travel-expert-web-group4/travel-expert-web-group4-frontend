import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Destinations from "./pages/FeaturedDestinations";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/destinations" element={<Destinations />} />
    </Routes>
  );
}

export default AppRoutes;
