/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        suse: ["SUSE", "sans-serif"],
        nerko: ["Nerko One", "cursive"],
        ma: ["Ma Shan Zheng", "sans-serif"],
      },
    },
  },
  plugins: [nextui()],
  darkMode: "class",
};
