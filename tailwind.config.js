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
        // Scoped design tokens for the customer-facing storefront only.
        // Do NOT reuse primary/secondary/gold above for new customer UI —
        // those still drive the admin/manager/staff dashboards.
        customer: {
          primary: '#176B3A',
          primaryDark: '#0B4028',
          accent: '#84C441',
          light: '#EDF6E8',
          cream: '#F7F4E9',
          earth: '#8A623D',
          ink: '#18231C',
          secondary: '#647068',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        // Scoped font for the customer-facing storefront only.
        customer: ['"Be Vietnam Pro"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
