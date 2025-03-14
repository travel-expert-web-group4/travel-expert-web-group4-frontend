import { Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import AboutUs from "./pages/AboutUs";
// import Destinations from "./pages/FeaturedDestinations";

// function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/about" element={<AboutUs />} />
//       <Route path="/destinations" element={<Destinations />} />
//     </Routes>
//   );
// }

// temporary placeholder component until creating the actual pages;
function Placeholder({ name }) {
  return <h1>{name} Page</h1>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder name="Home" />} />
      <Route path="/about" element={<Placeholder name="About Us" />} />
      <Route path="/destinations" element={<Placeholder name="Destinations" />} />
    </Routes>
  );
}
export default AppRoutes;
