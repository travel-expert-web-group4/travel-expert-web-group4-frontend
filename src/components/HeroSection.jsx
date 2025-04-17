// import React, { useState } from "react";
// import { FaSearch } from "react-icons/fa";

// const HeroSection = () => {
//   const [query, setQuery] = useState("");

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log("Searching for:", query);
//     // TODO: Implement actual search or scroll-to-results
//   };

//   return (
//     <section className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden">
//       {/* 🔳 Background Video */}
//       <video
//         autoPlay
//         loop
//         muted
//         playsInline
//         className="absolute inset-0 w-full h-full object-cover z-0"
//       >
//         <source src="/videos/hero-video.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       {/* 🔳 Dark Overlay */}
//       <div className="absolute inset-0 bg-black/60 z-10" />

//       {/* 📦 Hero Content */}
//       <div className="relative z-20 max-w-3xl w-full px-6 py-16 text-center">
//         <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-snug mb-6 animate-fadeIn">
//           Discover Your Next Adventure with <br />
//           <span className="text-yellow-400">Travel Experts</span>
//         </h1>

        

//         {/* 🔍 Search Bar */}
//         <form
//           onSubmit={handleSearch}
//           className="flex items-center bg-white rounded-full px-4 py-2 max-w-md mx-auto shadow-lg"
//         >
//           <FaSearch className="text-gray-500 mr-3" />
//           <input
//             type="text"
//             placeholder="Search destinations..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="flex-grow text-black outline-none placeholder-gray-400 bg-transparent"
//           />
//         </form>

//         {/* 👥 Trust Badge */}
//         <div className="mt-10 flex items-center justify-center gap-3 animate-fadeIn animate-delay-200">
//           <div className="flex -space-x-3">
//             {[1, 2, 3].map((id) => (
//               <img
//                 key={id}
//                 src={`https://randomuser.me/api/portraits/${id % 2 === 0 ? "women" : "men"}/${id}.jpg`}
//                 alt="Traveler"
//                 className="w-8 h-8 rounded-full border-2 border-white object-cover"
//               />
//             ))}
//           </div>
//           <p className="text-sm text-gray-300">
//             Trusted by <span className="font-bold text-white">5,000+</span> travelers
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/packages?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
        <source src="/videos/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 max-w-3xl w-full px-6 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-snug mb-6 animate-fadeIn">
          Discover Your Next Adventure with <br />
          <span className="text-yellow-400">Travel Experts</span>
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-full px-4 py-2 max-w-md mx-auto shadow-lg"
        >
          <FaSearch className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow text-black outline-none placeholder-gray-400 bg-transparent"
          />
        </form>

        <div className="mt-10 flex items-center justify-center gap-3 animate-fadeIn animate-delay-200">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((id) => (
              <img
                key={id}
                src={`https://randomuser.me/api/portraits/${id % 2 === 0 ? "women" : "men"}/${id}.jpg`}
                alt="Traveler"
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>
          <p className="text-sm text-gray-300">
            Trusted by <span className="font-bold text-white">5,000+</span> travelers
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
