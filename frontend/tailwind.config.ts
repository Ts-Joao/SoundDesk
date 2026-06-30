import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "-apple-system", "sans-serif"] },
      colors: {
        background: "#0D0E1C",
        surface: "#1A1B2E",
        "surface-2": "#10111E",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;
