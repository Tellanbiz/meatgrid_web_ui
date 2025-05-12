/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "#151922",
          hover: "#2c303b",
          active: "#3a3f4c",
          border: "#2c303b",
        },
        primary: {
          DEFAULT: "#F10027",
          100: "#FEE6EA",
          200: "#FDB2BC",
          300: "#FB7F8E",
          400: "#F94B60",
          500: "#F10027",
          600: "#C60021",
          700: "#9B001A",
          800: "#700013",
          900: "#45000C",
        },
        // Adds a blue accent color
        accent: {
          DEFAULT: "#4169E1",
          100: "#EDF0FD",
          200: "#C7D1F9",
          300: "#A1B3F5",
          400: "#7B94F1",
          500: "#4169E1",
          600: "#305CD6",
          700: "#274AB3",
          800: "#1D3891",
          900: "#14266E",
        }
      },
    },
  },
  plugins: [],
}; 