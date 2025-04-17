

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";

// const API_BASE_URL = "http://localhost:8080";

// const CustomPrevArrow = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
//   >
//     <FaArrowLeft className="text-gray-700" />
//   </button>
// );

// const CustomNextArrow = ({ onClick }) => (
//   <button
//     onClick={onClick}
//     className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
//   >
//     <FaArrowRight className="text-gray-700" />
//   </button>
// );

// const FeaturedDestinations = () => {
//   const [featuredPackages, setFeaturedPackages] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/api/package`);
//         if (!res.ok) throw new Error("Failed to load packages");
//         const data = await res.json();

//         const mapped = data.map((pkg) => ({
//           packageId: pkg.id,
//           name: pkg.pkgname,
//           startDate: pkg.pkgstartdate,
//           endDate: pkg.pkgenddate,
//           description: pkg.pkgdesc,
//           agencyCommission: pkg.pkgagencycommission,
//           basePrice: pkg.pkgbaseprice,
//           imageUrl: pkg.imageUrl ? `${API_BASE_URL}${pkg.imageUrl}` : null,
//           destination: pkg.destination || "Unknown",
//           rating: pkg.rating ?? null,
//           reviews: pkg.reviews || [],
//           lat: pkg.lat ?? null,
//           lng: pkg.lng ?? null,
//         }));

//         const topRated = mapped
//           .filter(pkg => pkg.rating >= 4.5)
//           .sort((a, b) => b.rating - a.rating)
//           .slice(0, 6);

//         setFeaturedPackages(topRated.length > 0 ? topRated : mapped.slice(0, 6));
//       } catch (err) {
//         console.error("Error loading featured packages", err);
//       }
//     };

//     fetchPackages();
//   }, []);

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3500,
//     arrows: true,
//     prevArrow: <CustomPrevArrow />,
//     nextArrow: <CustomNextArrow />,
//     responsive: [
//       { breakpoint: 1024, settings: { slidesToShow: 2 } },
//       { breakpoint: 768, settings: { slidesToShow: 1 } },
//     ],
//   };

//   return (
//     <section className="py-12 bg-gradient-to-b from-blue-50 to-white" id="featured">
//       <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">🌍 Featured Destinations</h2>
//       <div className="relative max-w-7xl mx-auto px-4">
//         <Slider {...settings}>
//           {featuredPackages.map((pkg) => (
//             <div key={pkg.packageId} className="px-4 md:px-6">
//               <div className="rounded-xl overflow-hidden shadow-md relative group">
//                 {/* 📷 Image */}
//                 <img
//                   src={
//                     pkg.imageUrl ||
//                     "https://source.unsplash.com/400x250/?travel,destination"
//                   }
//                   alt={pkg.name}
//                   className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-300"
//                 />

//                 {/* ⭐ Top Rated Badge */}
//                 {pkg.rating >= 4.5 && (
//                   <div className="absolute top-3 left-3 z-30 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow flex items-center gap-1">
//                     <FaStar className="text-white" /> Top Rated
//                   </div>
//                 )}

//                 {/* Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />

//                 {/* Info */}
//                 <div className="absolute bottom-0 p-5 z-20 text-white">
//                   <h3 className="text-2xl font-bold mb-1">{pkg.name}</h3>
//                   <p className="text-sm italic text-gray-200">📍 {pkg.destination}</p>
//                   <p className="text-green-300 font-semibold mb-2">From ${pkg.basePrice}</p>
//                   <p className="text-sm opacity-90 mb-4 line-clamp-2">{pkg.description}</p>
//                   <button
//                     onClick={() => {
//                       sessionStorage.setItem("selectedPackage", JSON.stringify(pkg));
//                       navigate(`/packages/${pkg.packageId}`, { state: pkg });
//                     }}
//                     className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-full shadow-md transition"
//                   >
//                     Learn More
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </section>
//   );
// };

// export default FeaturedDestinations;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";

const API_BASE_URL = "http://localhost:8080";

const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute z-10 left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
  >
    <FaArrowLeft className="text-gray-700" />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute z-10 right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition"
  >
    <FaArrowRight className="text-gray-700" />
  </button>
);

const FeaturedDestinations = () => {
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/package`);
        if (!res.ok) throw new Error("Failed to load packages");
        const data = await res.json();

        const mapped = data.map((pkg) => ({
          packageId: pkg.id,
          name: pkg.pkgname,
          startDate: pkg.pkgstartdate,
          endDate: pkg.pkgenddate,
          description: pkg.pkgdesc,
          agencyCommission: pkg.pkgagencycommission,
          basePrice: pkg.pkgbaseprice,
          imageUrl: pkg.imageUrl ? `${API_BASE_URL}${pkg.imageUrl}` : null,
          destination: pkg.destination || "Unknown",
          rating: pkg.rating ?? null,
          reviews: pkg.reviews || [],
          lat: pkg.lat ?? null,
          lng: pkg.lng ?? null,
        }));

        const topRated = mapped
          .filter(pkg => pkg.rating >= 4.5)
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 6);

        setFeaturedPackages(topRated.length > 0 ? topRated : mapped.slice(0, 6));
      } catch (err) {
        console.error("Error loading featured packages", err);
      }
    };

    fetchPackages();
  }, []);

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
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white" id="featured">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">🌍 Featured Destinations</h2>
      <div className="relative max-w-7xl mx-auto px-4">
        <Slider {...settings}>
          {featuredPackages.map((pkg) => (
            <div key={pkg.packageId} className="px-4 md:px-6">
              <div className="rounded-xl overflow-hidden shadow-md relative group">
                {/* 📷 Image */}
                <img
                  src={
                    pkg.imageUrl ||
                    "https://source.unsplash.com/400x250/?travel,destination"
                  }
                  alt={pkg.name}
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-300"
                />

                {/* ⭐ Top Rated Badge */}
                {pkg.rating >= 4.5 && (
                  <div className="absolute top-3 left-3 z-30 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <FaStar className="text-white" /> Top Rated
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />

                {/* Info */}
                <div className="absolute bottom-0 p-5 z-20 text-white">
                  <h3 className="text-2xl font-bold mb-1">{pkg.name}</h3>
                  <p className="text-sm italic text-gray-200">📍 {pkg.destination}</p>
                  <p className="text-green-300 font-semibold mb-4">From ${pkg.basePrice}</p>
                  <button
                    onClick={() => {
                      sessionStorage.setItem("selectedPackage", JSON.stringify(pkg));
                      navigate(`/packages/${pkg.packageId}`, { state: pkg });
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-medium rounded-full shadow-md transition"
                  >
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
