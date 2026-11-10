/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Light "ocean" theme: `white` is used as the main ink colour (navy),
      // `paper` is the real white surface colour.
      colors: {
        white: "#14294A",
        paper: "#FFFFFF",
        blush: "#F7EEDD",
        ocean: "#CFE2F4",
        electric: "#0A86C7",
        navy: {
          950: "#EAF1F8",
        },
        gold: {
          DEFAULT: "#B98A35",
          light: "#A9782A",
          dark: "#94661F",
        },
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
        serif: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        tamil: ['"Noto Serif Tamil"', "Latha", "Nirmala UI", "serif"],
      },
    },
  },
  plugins: [],
};
