/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokedex: {
          red: '#DC0A2D',
          darkred: '#B00020',
        }
      }
    },
  },
  plugins: [],
}
