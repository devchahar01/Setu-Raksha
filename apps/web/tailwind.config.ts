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
        // Institutional Palette
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#829AB1",
          500: "#627D98",
          600: "#486581",
          700: "#334E68",
          800: "#1E3A8A",
          900: "#0A192F",
          950: "#060D17",
        },
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
          950: "#042F2E",
        },
        // Risk-Tier Palette
        risk: {
          good: {
            DEFAULT: "#10B981", // Emerald
            light: "#ECFDF5",
            border: "#6EE7B7",
            text: "#065F46",
          },
          watch: {
            DEFAULT: "#F59E0B", // Amber
            light: "#FFFBEB",
            border: "#FCD34D",
            text: "#92400E",
          },
          warning: {
            DEFAULT: "#F97316", // Orange
            light: "#FFF7ED",
            border: "#FDBA74",
            text: "#9A3412",
          },
          critical: {
            DEFAULT: "#EF4444", // Crimson Red
            light: "#FEF2F2",
            border: "#FCA5A5",
            text: "#991B1B",
          },
        },
      },
      spacing: {
        "0.5": "2px",
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        devanagari: ["var(--font-devanagari)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
