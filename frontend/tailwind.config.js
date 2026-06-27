/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#0a0a0f',
          1: '#111118',
          2: '#16161d',
          3: '#18181f',
          card: 'rgba(22, 22, 29, 0.72)',
        },
        border: {
          DEFAULT: '#2a2a35',
          light: '#1e1e28',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
          dim: 'rgba(99, 102, 241, 0.12)',
          glow: 'rgba(99, 102, 241, 0.25)',
        },
        success: { DEFAULT: '#22c55e', dim: 'rgba(34, 197, 94, 0.12)' },
        warning: { DEFAULT: '#eab308', dim: 'rgba(234, 179, 8, 0.12)' },
        danger: { DEFAULT: '#ef4444', dim: 'rgba(239, 68, 68, 0.12)' },
        info: { DEFAULT: '#3b82f6', dim: 'rgba(59, 130, 246, 0.12)' },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        glow: '0 0 40px rgba(99, 102, 241, 0.15)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
        button: '0 10px 30px -15px rgba(99, 102, 241, 0.5)',
      },
      animation: {
        shimmer: 'shimmer 1.4s infinite',
        'fade-in': 'fadeIn 0.35s ease both',
        'slide-up': 'slideUp 0.4s ease both',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
