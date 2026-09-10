/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#EEF3F8",
          100: "#D9E4F0",
          500: "#1E4B8A",
          700: "#163A66",
          800: "#122F54",
          900: "#0B1B33",
          950: "#081526",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,39,68,.05), 0 8px 24px rgba(15,39,68,.06)",
        search: "0 18px 50px rgba(11,27,51,.12)",
      },
    },
  },
  plugins: [],
};
