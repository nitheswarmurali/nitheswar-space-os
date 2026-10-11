import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08090B', 'bg-2': '#101216', card: '#14171C', line: '#282C33',
        fg: '#F5F7FA', 'fg-2': '#9CA3AF', 'fg-3': '#697180'
      },
      fontSize: { '2xs': ['0.6875rem', '1rem'] }
    }
  },
  plugins: []
};
export default config;