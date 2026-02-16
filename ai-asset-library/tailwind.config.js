/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-blush': '#F6E3EA',
        'bg-lavender': '#E7E1F2',
        'primary': {
          DEFAULT: '#6A4AD8',
          500: '#7A4AB8',
          600: '#6A4AD8',
        },
        'accent': {
          red: '#B03048',
        },
        'text': {
          primary: '#1F1F1F',
          secondary: '#6B6B6B',
        },
        'border': {
          DEFAULT: '#E8E8EE',
        },
        'surface': {
          muted: '#F7F8FC',
        },
      },
      backgroundImage: {
        'gradient-wash': 'radial-gradient(circle at top right, rgba(246,227,234,0.9), rgba(231,225,242,0.6), transparent 60%)',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
