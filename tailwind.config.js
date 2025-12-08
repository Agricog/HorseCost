/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        horse: {
          50: '#faf7f5',
          100: '#f3ede8',
          200: '#e5d8cd',
          300: '#d4bfab',
          400: '#c1a085',
          500: '#b08968',
          600: '#a3785a',
          700: '#88624c',
          800: '#6f5142',
          900: '#5b4438',
          950: '#30221c',
        },
        forest: {
          50: '#f4f9f4',
          100: '#e5f2e6',
          200: '#cce5cf',
          300: '#a3d0a9',
          400: '#72b37b',
          500: '#4d9658',
          600: '#3b7a45',
          700: '#316139',
          800: '#2a4e30',
          900: '#244029',
          950: '#102314',
        },
        // Game-specific colors
        primary: {
          DEFAULT: '#FF4081', // Pink rosette
          dark: '#C60055',
        },
        secondary: '#00E676', // Grassy green
        accent: '#651FFF', // Deep purple/blue
        background: '#F3E5F5', // Light lavender
        surface: '#FFFFFF',
        text: {
          DEFAULT: '#3E2723', // Dark earthy brown
          light: '#5D4037',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pop': 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
