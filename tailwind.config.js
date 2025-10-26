/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          25: '#f9fafb',
          50: '#f4f8ff',
          100: '#e6f0ff',
          200: '#c2ddff',
          300: '#99c7ff',
          400: '#53a3ff',
          500: '#1d7fff',
          600: '#0d63d6',
          700: '#0a4ea8',
          800: '#083d82',
          900: '#062e61',
        },
        gray: {
          50: '#f8f9fb',
          100: '#f1f3f5',
          200: '#e2e6ea',
          300: '#cace d3'.replace(' ',''),
          400: '#94a1af',
          500: '#667281',
          600: '#4c5662',
          700: '#39414b',
          800: '#252b33',
          900: '#15191e',
          950: '#0d1218'
        },
        accent: {
          500: '#ffb347',
          600: '#f89a1c',
        },
        success: {
          500: '#12b886',
          600: '#0f966d'
        },
        warning: {
          500: '#f5b300',
          600: '#d99600'
        },
        danger: {
          500: '#e03131',
          600: '#c42525'
        },
        surface: {
          DEFAULT: '#11161d',
          raised: '#1a212b',
          sunken: '#0b0f14'
        }
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.96)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1.2s ease-out both',
      },
    },
  },
  plugins: [],
};