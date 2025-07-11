import { transform } from 'typescript';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Anton: ['"Anton"', 'serif'],
      },
    },
  },
  plugins: [],
}

