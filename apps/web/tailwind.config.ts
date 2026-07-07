import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-dark': 'var(--color-primary-dark)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        info: 'var(--color-info)',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Inter', 'sans-serif'],
        label: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(26, 5, 5, 0.12)',
        'elevation-2': '0 4px 12px rgba(26, 5, 5, 0.16)',
        'elevation-3': '0 8px 24px rgba(26, 5, 5, 0.20)',
        'elevation-4': '0 16px 48px rgba(26, 5, 5, 0.24)',
      },
    },
  },
  plugins: [],
} satisfies Config;
