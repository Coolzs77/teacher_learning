/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FDFCFA',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#EBE2D8',
          border: '#E5DEC9',
          card: '#FFFDF9',
        },
        wood: {
          900: '#231B15',
          800: '#2D241E',
          700: '#4A3B32',
          600: '#635145',
          500: '#7D695A',
          400: '#9B8574',
        },
        bamboo: {
          900: '#1D3B27',
          800: '#2C533A',
          700: '#3F6E50', // 浅竹青主色
          600: '#4D8261',
          500: '#649E79',
          400: '#7BB08E',
          300: '#9FC3AC',
          200: '#CFE2D3',
          100: '#E8F0E9', // 辅助竹青浅底
          50: '#F2F7F3',
        },
        cinnabar: {
          700: '#A43928',
          600: '#C24836', // 朱砂重点色
          300: '#E88B7D',
          200: '#F5BDB5',
          100: '#FCEBE8',
          50: '#FDF4F2',
        },
        amberGold: {
          600: '#D99B26',
          100: '#FBF3DF',
        }
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'STSong', 'SimSun', 'serif'],
        sans: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        'scholarly': '0 4px 20px -2px rgba(45, 36, 30, 0.06), 0 2px 6px -1px rgba(45, 36, 30, 0.04)',
        'scholarly-lg': '0 10px 25px -3px rgba(45, 36, 30, 0.08), 0 4px 10px -2px rgba(45, 36, 30, 0.05)',
        'scholarly-hover': '0 12px 28px -4px rgba(45, 36, 30, 0.12), 0 4px 12px -2px rgba(45, 36, 30, 0.08)',
      },
      keyframes: {
        cardEnter: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
        stamp: {
          '0%': { opacity: '0', transform: 'scale(1.4) rotate(-15deg)' },
          '60%': { opacity: '1', transform: 'scale(0.95) rotate(-10deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(-12deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(63, 110, 80, 0.4)' },
          '50%': { opacity: '0.9', boxShadow: '0 0 0 8px rgba(63, 110, 80, 0)' },
        }
      },
      animation: {
        'card-enter': 'cardEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shake': 'shake 0.3s ease-in-out',
        'stamp': 'stamp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'bounce-gentle': 'bounceGentle 0.3s ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      }
    },
  },
  plugins: [],
}
