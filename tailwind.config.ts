import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── DIOR ref / VYVRE signature palette ──
        bg: '#000000',           // pur noir (aligné PROTOCOL_DIOR)
        text: '#F5F4F0',         // ink champagne
        accent: '#7FE0A7',       // vert mint signature
        champagne: '#F0E5C8',    // champagne accent
        muted: '#8B7E6E',
        glass: 'rgba(245,244,240,0.04)',
        line: 'rgba(245,244,240,0.12)',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
      },
    },
  },
  plugins: [],
};

export default config;
