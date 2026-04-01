/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ksrtc: {
          primary: '#FF6B35',
          secondary: '#004E89',
          accent: '#FFD23F',
        }
      }
    },
  },
  plugins: [],
}
