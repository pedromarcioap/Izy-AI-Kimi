module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          850: '#1a1a1a',
          950: '#0a0a0a'
        },
        purple: {
          450: '#a855f7',
          550: '#9333ea'
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-lg': '0 0 30px rgba(168, 85, 247, 0.5)'
      }
    }
  },
  plugins: []
}
