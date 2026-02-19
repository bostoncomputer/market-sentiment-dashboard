import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a0f1e",
          900: "#0d1428",
          800: "#111c35",
          700: "#162040",
          600: "#1e2d52",
        },
        surface: "#111c35",
        border: "#1e2d52",
        bullish: "#22c55e",
        bearish: "#ef4444",
        neutral: "#6b7280",
      },
    },
  },
  plugins: [],
};
export default config;
