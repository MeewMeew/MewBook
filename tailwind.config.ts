import type { Config } from 'tailwindcss'
import * as Animated from 'tailwindcss-animatecss'

const Tailwind: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.html',
    './src/**/*.vue',
    './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'mb-blue': '#0084ff',
        'mb-blue-h': '#0866ff',
        'mb-gray': '#e4e6eb',
        'mb-gray-h': '#d0d2d6',
        'mb-gray-2': '#050505',
        'mb-secondary': '#65676B'
      }
    },
    minWidth: {
      xxs: '160px',
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    maxWidth: {
      '1/2': '50%',
      '2/3': '66.666667%',
      xxs: '160px',
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  },
  plugins: [Animated]
}

export default Tailwind

