/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    themes: ["light", "dark", "cupcake"],
    fontFamily: {
      helvetica: ["Helvetica", "Inter", "sans-serif"],
    },
    extend: {
      colors: {
          "my-positive": "#7ED532",
          "my-negative": "#EB2A2B",
          "my-btn-confirm": "#004EFF",
          "my-proposal-item-top": "#FB3D0E",
          "my-proposal-item-bottom": "#ADACB0",
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
