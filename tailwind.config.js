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
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}
