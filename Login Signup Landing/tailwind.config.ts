import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", // #ffffff
        foreground: "hsl(var(--foreground))", // #000000
        primary: {
          DEFAULT: "#1591ea", // Figma: #1591ea (primary blue)
          foreground: "#ffffff", // White text on primary
        },
        secondary: {
          DEFAULT: "#f3f0ea", // Figma: #f3f0ea (light beige for backgrounds)
          foreground: "#303031", // Figma: #303031 (dark gray text)
        },
        destructive: {
          DEFAULT: "#f14336", // Figma: #f14336 (red)
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f9f9f9", // Figma: #f9f9f9 (light gray)
          foreground: "#66645e", // Figma: #66645e (medium gray text)
        },
        accent: {
          DEFAULT: "#fbbb00", // Figma: #fbbb00 (yellow/orange)
          foreground: "#303031",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors from Figma
        "brand-blue": "#1591ea",
        "brand-blue-light": "#518ef8",
        "brand-text-dark": "#303031",
        "brand-text-medium": "#66645e",
        "brand-text-light": "#807e76",
        "brand-bg-beige": "#f3f0ea",
        "brand-bg-light-gray": "#f9f9f9",
        "brand-bg-input": "#f9f9f9", // Specific for input backgrounds if different from general light gray
        "brand-bg-gray": "#ececec",
        "brand-green": "#28b446",
        "brand-yellow": "#fbbb00",
        "brand-red": "#f14336",
        "brand-border": "#bfbfbf",
        "brand-black": "#000000",
        "brand-token-blue": "#007aff", // Design Token
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
