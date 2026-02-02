import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        // --- Loading ---
        'circle-loading': 'circle-loading 0.5s alternate infinite ease',
        'shadow-loading': 'shadow-loading 0.5s alternate infinite ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // --- Loading ---
        'circle-loading': {
          '0%': {
            top: '60px',
            height: '5px',
            borderRadius: '50px 50px 25px 25px',
            transform: 'scaleX(1.7)',
          },
          '40%': {
            height: '20px',
            borderRadius: '50%',
            transform: 'scaleX(1)',
          },
          '100%': {
            top: '0%',
          },
        },
        'shadow-loading': {
          '0%': {
            transform: 'scaleX(1.5)',
          },
          '40%': {
            transform: 'scaleX(1)',
            opacity: '0.7',
          },
          '100%': {
            transform: 'scaleX(0.2)',
            opacity: '0.4',
          },
        },
      },
      boxShadow: {
        'card': '0 10px 25px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 20px 35px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}
export default config