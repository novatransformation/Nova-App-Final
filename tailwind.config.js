/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Lotus-inspired color palette
        lotus: {
          // Petrol tones (backgrounds)
          'petrol-dark': '#183847',
          'petrol': '#244451',
          'petrol-light': '#2C5F6F',
          
          // Gold/Bronze tones (accents & headings)
          'gold': '#D4AF37',
          'gold-soft': '#C9A961',
          'bronze': '#B8956A',
          'bronze-dark': '#A6805B',
          
          // Text colors
          'cream': '#F5F1E8',
          'beige': '#E8DCC8',
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

