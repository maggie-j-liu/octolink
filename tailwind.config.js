const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.cyan,
        gray: colors.slate,
      },
    },
  },
  plugins: [],
};
