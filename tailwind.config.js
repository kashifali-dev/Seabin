/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      'serif': ['Proxima Nova', 'Futura', ...defaultTheme.fontFamily.serif],
      'sans': ['Proxima Nova', 'Futura', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      'seabin-blue': '#3579B9',
      'seabin-yellow': '#F4B241',
      'seabin-black': '#000000',
      'seabin-white': '#ffffff',
      'seabin-red': '#B22B2E',
      'seabin-orange': '#BB5627',
      'seabin-green': '#1F7446',
      'seabin-dark-blue': '#283B8B',
      'seabin-navy': '#045571',
      'seabin-light-blue': '#9FC3DF'
    },
    extend: {},
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.watermark': {
          width: "95%",
          height: "95%",
          position: 'absolute',
          top: '3%%',
          left: '0%',
          bottom: '3%',
          filter:  'grayscale(100%)', 
          //opacity: '0.2',
        }
      },)
    },),],
};
