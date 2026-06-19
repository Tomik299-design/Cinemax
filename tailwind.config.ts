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
        background: "#0B0F19",
        surface: "#111827",
        "surface-2": "#1a2235",
        accent: "#FF3040",
        "accent-hover": "#ff1a2e",
        "accent-muted": "#ff304020",
        gold: "#f5c518",
        muted: "#6b7280",
        border: "#1f2937",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
      },
      borderRadius: {
        card: "24px",
        lg: "16px",
        md: "12px",
      },
      backdropBlur: {
        glass: "20px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "shimmer": "shimmer 1.5s infinite",
        "pulse-glow": "pulseGlow 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px #FF304040" },
          "50%": { boxShadow: "0 0 40px #FF304080" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
