import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dee5fd',
          300: '#c4d1fb',
          400: '#a3b5f9',
          500: '#8396f4',
          600: '#6373eb',
          700: '#4c59d8',
          800: '#4149b0',
          900: '#383f8d',
          950: '#212552',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      animation: {
        'flip-in': 'flip-in 0.4s ease-out',
        'flip-out': 'flip-out 0.4s ease-in',
      },
      keyframes: {
        'flip-in': {
          '0%': { transform: 'rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', opacity: '1' },
        },
        'flip-out': {
          '0%': { transform: 'rotateY(0deg)', opacity: '1' },
          '100%': { transform: 'rotateY(-90deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
