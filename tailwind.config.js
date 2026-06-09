/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#000000',
        chat: '#0a0a0a',
        bubble: '#1c1c1c',
        input: '#1c1c1c',
        brand: '#ffffff',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#e5e5e5',
            h1: { color: '#ffffff' },
            h2: { color: '#ffffff' },
            h3: { color: '#ffffff' },
            h4: { color: '#ffffff' },
            p: { color: '#d4d4d4' },
            strong: { color: '#ffffff' },
            a: { color: '#ffffff' },
            'table thead th': { color: '#ffffff', borderColor: '#525252' },
            'table tbody td': { color: '#d4d4d4', borderColor: '#404040' },
          },
        },
      },
    },
  },
  plugins: [],
}
