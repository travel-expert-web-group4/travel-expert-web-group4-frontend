import React from "react";
import { motion } from "framer-motion";
import {
  GlobeAltIcon,
  HomeModernIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

const services = [
  {
    icon: <GlobeAltIcon className="w-12 h-12 text-blue-600" />,
    title: "Flight Reservation",
    desc: "Book domestic and international flights with ease."
  },
  {
    icon: <HomeModernIcon className="w-12 h-12 text-blue-600" />,
    title: "Hotel Reservation",
    desc: "Find and book the best accommodations worldwide."
  },
  {
    icon: <UserGroupIcon className="w-12 h-12 text-blue-600" />,
    title: "Tour Guide",
    desc: "Explore new destinations with expert guides."
  }
];

const Services = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50" id="services">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-12">🌟 Our Services</h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-md hover:shadow-xl hover:border-blue-500 transition duration-300"
            >
              <div className="flex justify-center mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
