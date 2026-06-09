/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#202123',
        chat: '#343541',
        bubble: '#40414F',
        input: '#40414F',
        brand: '#10a37f',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#ececf1',
            h1: { color: '#ececf1' },
            h2: { color: '#ececf1' },
            h3: { color: '#ececf1' },
            h4: { color: '#ececf1' },
            p: { color: '#d1d5db' },
            strong: { color: '#ececf1' },
            a: { color: '#10a37f' },
            'table thead th': { color: '#ececf1', borderColor: '#4b5563' },
            'table tbody td': { color: '#d1d5db', borderColor: '#374151' },
          },
        },
      },
    },
  },
  plugins: [],
}
