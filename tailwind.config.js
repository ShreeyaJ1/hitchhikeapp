/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Blue-500 for buttons and accents
        secondary: '#10B981', // Green-500 for success states
        background: '#F3F4F6', // Gray-100 for backgrounds
      },
    },
  },
  plugins: [],
}