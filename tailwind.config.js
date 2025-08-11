export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% center' },
          '50%': { 'background-position': '100% center' },
        },
      },
      backgroundSize: {
        '200%': '200% auto',
      },
    }
  },
  plugins: [],
}
