module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: '#1D3A2C',
        sand: '#EAF7EF',
        'forest-green': '#1B9F72',
        clay: '#2A5B46',
        cream: '#F3FBF6',
        moss: '#62B78D',
        sun: '#9CD27B',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}
