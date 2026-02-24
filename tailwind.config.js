/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#58cc02',
        secondary: '#ff9600',
        accent: '#1cb0f6',
      }
    },
  },
  plugins: [],
}
