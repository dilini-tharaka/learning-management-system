/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        recoleta: ['Recoleta', 'serif'], // Add Recolate font
      },
      colors: {
        // Custom background colors for dark mode
        'background':  'rgba(255, 255, 255, <alpha-value>)', // zinc-0
        'background-secondary': {
          DEFAULT: '#f4f4f5', // zinc-100
          dark: '#27272a', // zinc-800
        }
      }
    },
  },
  plugins: [],
};
