/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC', // ConsultAdd's blue
          dark: '#004C99',
          light: '#3399FF',
        },
        secondary: {
          DEFAULT: '#2C3E50', // Dark gray for text
          light: '#95A5A6',
        },
      },
    },
  },
  plugins: [],
} 