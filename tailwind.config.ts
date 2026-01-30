import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f8f3ee",
        blush: "#f7d6e7",
        rose: "#f3a6c8",
        orchid: "#c59fe3",
        plum: "#6f4b8b"
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
