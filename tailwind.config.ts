import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cosmic: {
          900: "#0a0b14",
          800: "#0f111a",
          700: "#1a1c2e",
          600: "#252842",
          500: "#30203f",
        },
        gold: {
          50: "#fff9ef",
          100: "#ffeccd",
          200: "#ffd9a5",
          300: "#ffd4a1",
          400: "#ffb347",
          500: "#ff8d47",
          600: "#e67a3a",
        },
        mystic: {
          purple: "#9b59b6",
          blue: "#3498db",
          green: "#9ce8c4",
          teal: "#1abc9c",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        sora: ["var(--font-sora)", "sans-serif"],
      },
      backgroundImage: {
        "cosmic-gradient":
          "linear-gradient(145deg, #0a0b14, #30203f)",
        "gold-gradient":
          "linear-gradient(120deg, #ffb347, #ff8d47)",
        "glass-surface":
          "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255,179,71,0.3)",
        "glow-lg": "0 0 40px rgba(255,179,71,0.2)",
        cosmic: "0 18px 48px rgba(0,0,0,0.35)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,179,71,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255,179,71,0.5)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
