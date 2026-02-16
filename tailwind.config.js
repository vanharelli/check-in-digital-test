/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FFD700',
          500: '#D4AF37',
          600: '#B8860B',
        },
        black: {
          900: '#000000',
          800: '#111111',
        }
      }
    },
  },
  plugins: [],
}
