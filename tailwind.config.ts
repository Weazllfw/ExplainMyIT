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
        brand: {
          navy: '#1F3A5F',         // Primary: authority, text, buttons
          cyan: '#4FB6C6',          // Accent: clarity, highlights, links
          slate: '#445468',         // Secondary text
          bg: '#F6F8FB',            // Page background
          surface: '#FFFFFF',       // Cards
          border: '#E6ECF2',        // Borders, dividers
          muted: '#6B7C93',         // Muted text
          positive: '#2E8B57',      // Positive signals (use sparingly)
          green: '#2E8B57',         // Green for pricing badges
          caution: '#D6A545',       // Caution, not warning (muted amber)
          info: '#7A8CA6',          // Info / neutral badge
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 6px 24px rgba(31, 58, 95, 0.08)',
        'brand-hover': '0 10px 32px rgba(31, 58, 95, 0.12)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4FB6C6 0%, #1F3A5F 100%)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: '#445468',
            a: {
              color: '#4FB6C6',
              '&:hover': {
                color: '#1F3A5F',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
