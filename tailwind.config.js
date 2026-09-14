/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./data/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "green-dk2": "#083C28",
        "green-dk": "#0B4D33",
        green: "#0F6B45",
        emerald: "#17A374",
        lime: "#C8F049",
        cream: "#FAF8F1",
        ink: "#10241C",
        "ink-soft": "#5B6D64",
        line: "#E9E6D9",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Amiri", "Traditional Arabic", "serif"],
      },
      borderRadius: {
        xl2: "20px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(11,77,51,0.06)",
        nav: "0 -6px 20px rgba(11,77,51,0.06)",
      },
    },
  },
  plugins: [],
};
