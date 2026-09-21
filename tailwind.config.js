/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1A3626',
          primary: '#2E5A44',
          medium: '#4D7C5D',
          light: '#7E9E8B',
          soft: '#E8EFEA',
          subtle: '#F3F7F4',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F3EFEA',
          200: '#E6E0D5',
          300: '#D5CCC0',
          500: '#9E9382',
          700: '#6B6255',
          800: '#484137',
          900: '#2B2620',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F4F1EB',
          subtle: '#EFECE6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(28, 30, 33, 0.04)',
        'sm': '0 2px 6px rgba(28, 30, 33, 0.05), 0 1px 2px rgba(28, 30, 33, 0.03)',
        'md': '0 6px 20px rgba(28, 30, 33, 0.06), 0 2px 4px rgba(28, 30, 33, 0.03)',
        'lg': '0 14px 36px rgba(28, 30, 33, 0.08), 0 4px 10px rgba(28, 30, 33, 0.04)',
        'xl': '0 24px 50px -8px rgba(28, 30, 33, 0.12)',
        'door': '0 16px 32px rgba(43, 38, 32, 0.18), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
      },
      borderRadius: {
        'xl': '24px',
        '2xl': '28px',
        '3xl': '32px',
      }
    },
  },
  plugins: [],
}
