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
        paper: "#F9F6F0",
        ink: "#121212",
        sage: "#CFE3C8",
        butter: "#F6E7A1",
        lavender: "#D9CCF0",
        peach: "#F7D3C1",
        sky: "#CDE4F2",
        tomato: "#E8553D",
        "sage-dark": "#5E8C61",
        charcoal: "#1A1A1A",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        brutal: "4px 4px 0 #121212",
        "brutal-lg": "6px 6px 0 #121212",
        "brutal-none": "0 0 0 #121212",
      },
      borderRadius: {
        paper: "8px",
      },
    },
  },
  plugins: [],
};
export default config;
