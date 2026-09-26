/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#050505',
          dark: '#0A0A0A',
          card: '#0D0D0D',
          elevated: '#141414',
          border: '#252525',
          borderLight: '#333333',
          borderGold: 'rgba(201, 162, 39, 0.25)',
          borderBlood: 'rgba(139, 0, 0, 0.35)',
          text: '#F5F5F5',
          muted: '#B8B8B8',
          dim: '#777777',
          accent: '#E8E8E8',
          subtle: '#BDBDBD',
          // Blood Red Palette
          blood: '#8B0000',
          bloodHover: '#A30000',
          bloodDark: '#5C0000',
          bloodBright: '#B11226',
          // Gold Palette
          gold: '#D4AF37',
          goldPrimary: '#C9A227',
          goldRich: '#B8860B',
          goldLight: '#E0C36E',
          goldMuted: 'rgba(212, 175, 55, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        editorial: ['Cinzel', 'Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        ultra: '0.25em',
        widest: '0.15em',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
