/* eslint-disable no-unused-vars */
// @ts-nocheck
const path = require('path')
const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        gray2: 'var(--color-gray)',
        rose: colors.rose,
        black: colors.black,
        white: colors.white,
        slate: colors.slate,
        green: colors.green,
        violet: colors.violet,
        amber: colors.amber,
        fuchsia: colors.fuchsia,
        blue: colors.blue,
        red: colors.red,
        yellow: colors.yellow,
        gray: colors.gray,
        zinc: colors.zinc,
        neutral: colors.neutral,
        stone: colors.stone,
        orange: colors.orange,
        lime: colors.lime,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        indigo: colors.indigo,
        purple: colors.purple,
        pink: colors.pink,
        //custom color
        base: '#f7f7f8',
        card: '#ffffff',
        title_color: '#151e41',
      },
      fontSize: {
        tiny: '0.4rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1600px', // Định nghĩa cho màn hình 3xl (1600px trở lên)
        '4xl': '1920px', // Định nghĩa cho màn hình 4xl (1920px trở lên)
        '5xl': '2560px', // Định nghĩa màn hình 5xl (2560px trở lên)
      },
      width: {
        256: '64rem',
      },
    },
  },
  variants: {
    extend: {
      cursor: ['disabled'],
      textOpacity: ['disabled'],
      textColor: ['disabled'],
      flexDirection: ['responsive'], // Đảm bảo hỗ trợ responsive cho flex-direction
    },
  },
  plugins: [],
}
