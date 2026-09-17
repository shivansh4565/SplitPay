/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      colors: {
        splitDark: {
          950: '#04130d',
          900: '#061a12',
          850: '#0a231a',
          800: '#0e3124',
          700: '#144634',
        },
        splitMint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        }
      },
      backgroundImage: {
        'hero-gradient-dark': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16, 185, 129, 0.25), transparent 70%), linear-gradient(to bottom, #061d15, #0a291f 40%, #051811 100%)',
        'hero-gradient-light': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(16, 185, 129, 0.15), transparent 70%), linear-gradient(to bottom, #f0fdf4, #ffffff 50%, #f4fdf8 100%)',
      }
    },
  },
  plugins: [],
}