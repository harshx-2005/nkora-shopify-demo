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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "#d8758d",
        },
        softPink: {
          DEFAULT: "var(--soft-pink)",
          hover: "#e4bdc3",
        },
        blueAccent: {
          DEFAULT: "var(--blue-accent)",
          hover: "#6b7ea1",
        },
        lightGray: "var(--light-gray)",
        borderCustom: "var(--border-color)",
        textDark: "var(--text-dark)",
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        nunito: ["var(--font-nunito)", "sans-serif"],
        dm: ["var(--font-dmsans)", "sans-serif"],
      },
      maxWidth: {
        site: "1400px",
      },
    },
  },
  plugins: [],
};
export default config;

