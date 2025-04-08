import React from "react";
import { motion } from "framer-motion";
import manImage from "../assets/images/man.jpeg";
import womanImage from "../assets/images/woman.jpeg";
import sampleWoman2Image from "../assets/images/samplewoman2.jpeg";

const testimonials = [
  {
    name: "David Patel",
    image: manImage,
    quote: "Exceptional service! Travel Tales planned the perfect honeymoon for me!"
  },
  {
    name: "Sophia Rodriguez",
    image: womanImage,
    quote: "Their team helped me find a luxury resort in Dubai. Highly recommended!"
  },
  {
    name: "Rachel Lee",
    image: sampleWoman2Image,
    quote: "From flights to hotels, they handled everything. 10/10 would book again!"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white" id="testimonials">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-12">💬 What Our Customers Say</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-slate-50 rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center"
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-24 h-24 object-cover rounded-full ring-4 ring-blue-500 mb-4 hover:scale-105 transition duration-300"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.name}</h3>
              <p className="text-sm text-gray-600 italic">"{t.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
