/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#06090e',
          900: '#0b0f19',
          850: '#111726',
          800: '#1a2236',
          750: '#232d46',
          700: '#2e3b5a',
          600: '#3d4d75',
          500: '#546694',
          400: '#7588b6',
          300: '#9cb0d9',
          200: '#c5d4f5',
          100: '#e8f0fe',
        },
        hazard: {
          safe: '#10b981',
          warning: '#f59e0b',
          high: '#f97316',
          critical: '#ef4444',
          cyan: '#06b6d4',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 4s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
