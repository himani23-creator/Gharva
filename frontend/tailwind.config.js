/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50914', // Using a Netflix-like red as the accent
        background: '#0B0B0C', // Very dark background
        card: '#161618', // Slightly lighter dark for cards
        textMuted: '#9CA3AF'
      }
    },
  },
  plugins: [],
}
