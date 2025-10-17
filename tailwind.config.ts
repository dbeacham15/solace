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
        // Solace Health brand color palette
        solace: {
          // Primary - Solace Brand Blue (vibrant, trustworthy, modern)
          primary: {
            50: '#f0f3ff',
            100: '#e4e9ff',
            200: '#cdd7ff',
            300: '#abb8ff',
            400: '#8591ff',
            500: '#4d65ff', // Solace brand primary
            600: '#3d4edb',
            700: '#2f3bb0',
            800: '#232d85',
            900: '#1a2161',
          },
          // Secondary - Complementary purple/indigo
          secondary: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
          // Accent - Soft green (health, wellness, positive outcomes)
          accent: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          // Neutral - Clean grays (professional, accessible)
          neutral: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
        },
        // Keep healthcare alias for backwards compatibility
        healthcare: {
          primary: {
            50: '#f0f3ff',
            100: '#e4e9ff',
            200: '#cdd7ff',
            300: '#abb8ff',
            400: '#8591ff',
            500: '#4d65ff',
            600: '#3d4edb',
            700: '#2f3bb0',
            800: '#232d85',
            900: '#1a2061',
          },
          secondary: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
          accent: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          neutral: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-healthcare": "linear-gradient(135deg, #f0f3ff 0%, #f5f3ff 100%)",
        "gradient-solace": "linear-gradient(135deg, #f0f3ff 0%, #f5f3ff 100%)",
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
        heading: ['Mollie Gibson', 'Lato', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'healthcare': '12px',
      },
    },
  },
  plugins: [],
};
export default config;
