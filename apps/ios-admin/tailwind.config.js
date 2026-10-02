/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        svBrand: "#4F46E5",
        svBrandHover: "#4338CA",
        svBrandActive: "#3730A3",
        svBrandSubtle: "#EEF2FF",
        svBrandSelected: "#E0E7FF",
        svBrandBorder: "#A5B4FC",
        svBrandStrong: "#312E81",
        svDark: "#0F172A",
        svSlate: "#1E293B",
        svPanel: "#111827",
        svBackground: "#F6F8FC",
        svSurface: "#FFFFFF",
        svSoft: "#F8FAFC",
        svLine: "#E2E8F0",
        svGreen: "#059669",
        svRed: "#DC2626",
        svWarning: "#D97706",
        svGold: "#CA8A04",
        svOlive: "#0F766E"
      }
    }
  },
  plugins: []
};
