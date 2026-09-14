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
          200: '#CFE2D3',
          100: '#E8F0E9', // 辅助竹青浅底
          50: '#F2F7F3',
        },
        cinnabar: {
          700: '#A43928',
          600: '#C24836', // 朱砂重点色
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
      }
    },
  },
  plugins: [],
}
