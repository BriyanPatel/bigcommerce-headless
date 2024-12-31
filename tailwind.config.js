/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'sm': '480px', // Add this line to set the 'sm' breakpoint to 480px
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000000',
        primary: '#b80d0d',
        secondary: '#000',
        white: '#FFFFFF',
        error: {
          DEFAULT: '#AD0000',
          secondary: '#C62828',
        },
        success: {
          DEFAULT: '#146622',
          secondary: '#388E3C',
        },
        gray: {
          100: '#F1F3F5',
          200: '#CFD8DC',
          300: '#AFBAC5',
          400: '#90A4AE',
          500: '#546E7A',
          600: '#091D45',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        oswald: ['Oswald', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: '#CFD8DC',
      },
      keyframes: {
        revealVertical: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
      },
      animation: {
        revealVertical: 'revealVertical 400ms forwards cubic-bezier(0, 1, 0.25, 1)',
      },
    },
  },

  plugins: [
    // @ts-ignore
    /* eslint-disable global-require */
    require('tailwindcss-radix')(),
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
    /* eslint-enable global-require */
  ],
};

module.exports = config;