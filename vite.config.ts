import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/teacher_learning/', // GitHub Pages 仓库根路径
  server: {
    port: 5173,
    open: false
  }
})
