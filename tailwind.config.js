/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pathA: '#9333ea',
        pathB: '#10b981',
        pathC: '#3b82f6',
      }
    },
  },
  plugins: [],
}