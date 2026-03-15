import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          975: "#060816",
        },
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at top left, rgba(79, 70, 229, 0.2), transparent 30%), radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.18), transparent 22%), radial-gradient(circle at bottom right, rgba(244, 114, 182, 0.14), transparent 28%)",
      },
      boxShadow: {
        glow: "0 24px 80px rgba(15, 23, 42, 0.18)",
        card: "0 18px 50px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 10s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
