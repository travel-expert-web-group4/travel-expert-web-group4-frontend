/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      clipPath: {
        diagonal: "polygon(0 0, 100% 0, 100% 85%, 0% 100%)",
      },
      keyframes: {
        twinkle: {
          "0%": { opacity: "0", transform: "scale(0.5)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
          "100%": { opacity: "0", transform: "scale(0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        
      },
      animation: {
        twinkle: "twinkle 2s infinite ease-in-out",
        float: "float 3s ease-in-out infinite",
        fadeIn: "fadeIn 1s ease-in-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
