import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#F59E0B",
          500: "#EA580C",
          600: "#C2410C",
          700: "#9A3412",
          800: "#7C2D12",
          900: "#431407",
        },
        booking: {
          background: "#0C0900",
          surface: "#1A1200",
          "surface-alt": "#221800",
          heading: "#FFFFFF",
          body: "#C4B49A",
          selected: "#2D1C00",
          border: "#2E2008",
          primary: "#F59E0B",
          "primary-hover": "#D97706",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-manrope)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
