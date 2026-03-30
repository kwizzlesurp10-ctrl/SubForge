import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          300: '#bef264',
          400: '#a3e635',
        },
      },
      boxShadow: {
        neon: '0 0 20px #a3e635, 0 0 40px #a3e635',
        'neon-pink': '0 0 20px #ec4899, 0 0 40px #ec4899',
      },
    },
  },
  plugins: [],
};

export default config;
