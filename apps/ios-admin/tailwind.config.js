/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        svBrand: "#F97316",
        svBrandHover: "#EA580C",
        svBrandActive: "#C2410C",
        svBrandSubtle: "#FFF7ED",
        svBrandSelected: "#FFEDD5",
        svBrandBorder: "#FDBA74",
        svBrandStrong: "#9A3412",
        svDark: "#120A00",
        svSlate: "#241505",
        svPanel: "#1A1200",
        svBackground: "#F8F1E7",
        svSurface: "#FFFFFF",
        svSoft: "#FFFBF5",
        svLine: "#E7D6C4",
        svGreen: "#059669",
        svRed: "#DC2626",
        svWarning: "#F59E0B",
        svGold: "#D97706",
        svOlive: "#65A30D"
      }
    }
  },
  plugins: []
};
