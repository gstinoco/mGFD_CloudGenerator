/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./templates/**/*.html",
    "./static/js/**/*.js"
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        apple: {
          dark: '#1d1d1f',
          light: '#f5f5f7',
          blue: '#0066cc',
          blueHover: '#004499',
          gray: '#86868b'
        }
      },
      boxShadow: {
        'apple': '0 4px 24px rgba(0,0,0,0.06)',
        'apple-hover': '0 10px 40px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}
