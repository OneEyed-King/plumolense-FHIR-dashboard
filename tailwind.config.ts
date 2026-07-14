import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
      colors: {
        border: "hsl(30 20% 88%)",
        background: "hsl(40 33% 98%)",
        foreground: "hsl(20 14% 12%)",
        muted: {
          DEFAULT: "hsl(35 25% 94%)",
          foreground: "hsl(25 10% 45%)",
        },
        primary: {
          DEFAULT: "hsl(200 70% 32%)",
          foreground: "hsl(40 33% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 72% 48%)",
          foreground: "hsl(40 33% 98%)",
        },
        accent: {
          DEFAULT: "hsl(35 30% 92%)",
          foreground: "hsl(20 14% 15%)",
        },
      },
      borderRadius: {
        lg: "0.625rem",
        md: "0.5rem",
        sm: "0.3125rem",
      },
    },
  },
  plugins: [],
};
export default config;
