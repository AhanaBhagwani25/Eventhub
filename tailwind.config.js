/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        paper: "#F8FAFC",
        marigold: "#F97316",
        night: "#0F172A",
        nightcard: "#141C33",
        ember: "#C23B1A",
        emberlight: "#FF8A6B",
        pine: "#0B7A6B",
        pinelight: "#4FD1B8",
        primary: "#7C3AED",
        primaryglow: "#A78BFA",
      },
      fontFamily: {
        display: ['"Inter"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #7C3AED, #4D5BFF)",
        "gradient-hero": "linear-gradient(180deg, #ffffff, #F7F3FF)",
        "gradient-hero-dark": "linear-gradient(180deg, #0F172A, #1A1840)",
      },
      boxShadow: {
        large: "0 20px 25px -5px rgb(0 0 0 / 0.12), 0 8px 10px -6px rgb(0 0 0 / 0.08)",
        glow: "0 0 40px rgb(167 139 250 / 0.35)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "none" } },
        "scale-in": { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
