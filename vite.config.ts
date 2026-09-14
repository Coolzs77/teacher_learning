import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 保证静态托管 (如 GitHub Pages) 相对路径正确
  server: {
    port: 5173,
    open: false
  }
})
