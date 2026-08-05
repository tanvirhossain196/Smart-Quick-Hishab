import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1E3A5F",
          primaryDark: "#132A45",
          secondary: "#0EA5B7",
          accent: "#F97316",
          success: "#16A34A",
          danger: "#DC2626",
          bg: "#EEF1F4",
          card: "#FFFFFF",
          ink: "#101820",
          inkSoft: "#52606D",
          border: "#D7DEE5",
          graphite: "#0B1220",
          graphiteSoft: "#16212E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "brand-hero":
          "radial-gradient(1000px 480px at 10% -10%, #1E3A5F14, transparent), radial-gradient(800px 460px at 100% 0%, #F9731614, transparent)",
        "brand-gradient": "linear-gradient(135deg, #1E3A5F 0%, #0EA5B7 100%)",
        "brand-gradient-accent": "linear-gradient(135deg, #F97316 0%, #DC2626 100%)",
        blueprint:
          "linear-gradient(#1E3A5F0d 1px, transparent 1px), linear-gradient(90deg, #1E3A5F0d 1px, transparent 1px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,32,0.04), 0 8px 24px -8px rgba(16,24,32,0.14)",
        "card-lg": "0 4px 6px rgba(16,24,32,0.05), 0 20px 40px -12px rgba(16,24,32,0.22)",
        glow: "0 0 0 1px #1E3A5F1a, 0 8px 30px -8px #1E3A5F4d",
        "glow-accent": "0 0 0 1px #F973161a, 0 8px 30px -8px #F9731655",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
