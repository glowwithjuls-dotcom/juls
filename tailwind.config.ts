import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C768A0',
          dark: '#9C3D78',
          light: '#FCE8F3',
        },
        charcoal: '#1F1F1F',
      },
      fontFamily: {
        display: ['var(--font-playfair)'],
        body: ['var(--font-inter)'],
      },
      boxShadow: {
        card: '0 12px 35px rgba(24, 7, 28, 0.08)',
      },
    },
  },
  plugins: [forms({ strategy: 'class' })],
};

export default config;
