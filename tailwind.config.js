/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#0f0d18",
        "surface": "#161320",
        "surface-high": "#1e1b2e",
        "on-surface": "#eae6ff",
        "on-surface-variant": "#9b96b8",
        "outline-variant": "#2d2a42",
        "primary": "#cabeff",
        "primary-container": "#7B5CFA",
        "on-primary": "#1c0062",
      },
      fontFamily: {
        "display": ["Libre Caslon Text", "serif"],
        "body": ["Hanken Grotesk", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"],
      }
    },
  },
  plugins: [],
}