/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#123524',
        secondary: '#2f7d32',
        gold: '#b6d645',
        'gold-light': '#d9ef83',
        'bg-light': '#f4f8f1',
        'bg-dark': '#101622',
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
