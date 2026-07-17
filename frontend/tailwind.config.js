/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep modern palette
        primary: {
          50: '#f2faf4',
          100: '#e2f5e7',
          200: '#c7ebd2',
          300: '#9cd8ae',
          400: '#68be81',
          500: '#43a25e',
          600: '#32844a',
          700: '#2a693c',
          800: '#235432',
          900: '#1e462b',
        },
      },
    },
  },
  plugins: [],
}
