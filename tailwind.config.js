/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-purple': {
          light: '#e0d4fc',
          DEFAULT: '#7C3AED',
          dark: '#581C87',
        },
        'node-header-main': '#4361ee',
        'node-header-decision': '#ffb703',
        'node-header-beginend': '#4cc9f0',
        'node-header-critical': '#f72585',
      }
    },
  },
  plugins: [],
}
